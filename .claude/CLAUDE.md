# Claude Project Guide

## Read First

- **每次涉及数据库相关代码前，先读 `prisma/schema.prisma`**，以当前 schema 为准，不做假设。
- 这是 Next.js 16.2.6 App Router 项目，不要假设旧版 Next.js 的 middleware 或路由行为。
- Next.js 16 使用 `proxy.ts` 代替 `middleware.ts`，请求拦截入口在 `src/proxy.ts`，不要新增 `middleware.ts`。

## Project Snapshot

- Framework: Next.js 16.2.6, React 19.2.4, TypeScript strict mode
- Styling: Tailwind CSS v4，主题 token 定义在 `src/ui/globals.css`
- Database: PostgreSQL，通过 Prisma 7 + `@prisma/adapter-pg` 访问
- Prisma client 输出：`src/generated/prisma`，视为生成代码不可手动编辑
- Auth: cookie-based JWT（`jose` 签名/验证，`bcryptjs` 密码哈希，`zod` 输入校验）
- 主题色：背景 `#20202b`，hover/激活 `rgba(242,242,242,0.1)`，均通过 CSS token 管理

## Common Commands

```bash
npm run dev
npm run build
npx tsc --noEmit      # 快速类型检查，改完代码必跑
npx tsx prisma/seed.ts
```

- 不要在未经用户确认的情况下执行 seed 或 migrate。

## Directory Map

```txt
src/
  app/
    login/
      layout.tsx              登录页布局
      page.tsx                登录/注册页（使用 AuthForm）
    (dashboard)/
      layout.tsx              主应用布局（prismaGetLoginUser → ProfileProvider + 侧边栏 + 顶部栏）
      posts/
        page.tsx              帖子列表页（纯壳，数据由 PostList 客户端拉取）
        [id]/page.tsx         帖子详情（Server，含评论 + 点赞）
        new/page.tsx          新建帖子
      profile/
        layout.tsx            个人中心布局（渲染 Profile 组件）
        page.tsx              个人主页占位
        posts/
          page.tsx            我发布的帖子列表（Server）
          [id]/page.tsx       我的帖子详情（Server）
    layout.tsx                根布局（ThemeProvider）
    page.tsx                  首页入口
    loading.tsx / error.tsx / not-found.tsx
  lib/
    auth.ts                   纯鉴权工具：JWT 签名/验证、Cookie 读写、verifyAuth()、buildLoginRedirectUrl()
    prisma.ts                 Prisma 单例（PrismaPg adapter）
    dal/
      post.ts                 帖子 Prisma 查询 + 类型（prismaGetPosts、prismaGetPostById、Post、PostDetail）
      profile.ts              用户 Prisma 查询 + 类型（prismaGetLoginUser、prismaGetMyPosts、prismaUpdateUserProfile、Profile、MyPost）
      user.ts                 账号 Prisma 操作（prismaFindUserByAccount、prismaCreateUser）
    actions/
      auth.ts                 fetchLoginAction（登录/注册，客户端入口）
      profile.ts              updateProfileAction（编辑个人资料，客户端入口）
      post.ts                 fetchPostsAction（无限滚动加载，客户端入口）
  ui/
    globals.css               Tailwind v4 + 全局主题 token
    aside/
      AsideNav.tsx            左侧固定侧边栏（Logo + 导航 + 用户信息）
    header/
      HeaderNav.tsx           顶部 sticky 导航栏（Search + 发布按钮）
    login/
      AuthForm.tsx            登录/注册表单（'use client'）
    post/
      PostCard.tsx            帖子卡片
      PostList.tsx            帖子列表（'use client'，自管分页 + 无限滚动）
      PostIcon.tsx            互动数据图标
      CardSkeleton.tsx        骨架屏
      Search.tsx              搜索框（更新 URL keywords）
    profile/
      Profile.tsx             个人信息展示 + 编辑组件（'use client'）
      ProfilePrivider.tsx     Profile React Context（'use client'）
    NavHeader.tsx             通用返回导航头（帖子详情页使用）
    ScrollPage.tsx            保留文件（当前逻辑已移入 PostList）
    ThemePrivider.tsx         主题 Context 包装器
    AppLogo.tsx / TopLogo.tsx Logo 组件
    icon/                     图标组件
  config/fetch.config.ts      fetch 封装
  proxy.ts                    Next 16 Proxy 入口（写入 x-current-path 响应头）

prisma/
  schema.prisma               数据库模型（source of truth）
  seed.ts                     Mock 数据（可重复运行）
  migrations/                 迁移历史
```

## 主题系统

主题色统一在 `src/ui/globals.css` 的 `:root` 中定义，只需修改这三行即可切换主题：

```css
:root {
  --background: #20202b;
  --foreground: #f0f0f0;
  --hover: rgba(242, 242, 242, 0.1);
}
```

组件里使用语义类（`bg-background`、`bg-hover`、`text-muted-foreground` 等），**不要在单个元素上硬编码颜色**。

## Auth System

### 认证流程

1. `fetchLoginAction`（`lib/actions/auth.ts`）接收表单，zod 校验，查账号是否存在
2. 存在 → bcrypt 验密码；不存在 → 创建用户
3. 调 `setAuthCookie(userId)` 写 httpOnly cookie `access_token`（HS256 JWT，24h）
4. 从 `Referer` 头读取 `?redirect=` 参数，登录后跳回原页面

### 鉴权失败跳转

`verifyAuth()` 失败时跳转 `/login?redirect=<当前路径>`，路径由 `proxy.ts` 写入 `x-current-path` 响应头读取。

### 函数选择

```
只需要 userId（写操作、鉴权）→ verifyAuth()             仅验 JWT，不查 DB
需要展示用户信息               → prismaGetLoginUser()   JWT + DB 查询
```

### ProfileProvider 模式

`(dashboard)/layout.tsx` 调用 `prismaGetLoginUser()` 一次，结果通过 `<ProfileProvider>` 注入。
子组件调 `useProfile()` 获取用户数据，无需额外请求。

## 数据层分层

```
Client Component
      ↓ 调用
lib/actions/*    （'use server'，命名规则：fetchXxxAction / updateXxxAction）
      ↓ 调用
lib/dal/*        （纯服务端数据函数，命名规则：prismaXxx，直接操作 Prisma）
      ↓
lib/prisma.ts    （Prisma 单例）
```

- Server Component / layout 可以直接调 `lib/dal/*`，无需经过 actions
- Client Component 只能调 `lib/actions/*`
- `lib/actions/*` 中不允许直接 import prisma，必须通过 `lib/dal/*`
- 新增数据库操作：先在 `lib/dal/` 写 `prismaXxx` 函数，再在 `lib/actions/` 写 `xxxAction` 暴露给客户端

## Post Feed 行为

- `keywords` 存 URL（驱动 Search 组件），`pageNo` 不存 URL
- `PostList` 客户端组件自管状态：挂载时拉第一页，搜索词变化时重置，滚动到底追加
- 无限滚动用 `IntersectionObserver` 监听哨兵元素，与滚动容器无关
- 刷新永远从第 1 页开始，没有 pageNo 的歧义

## Layout 结构

```
flex h-screen overflow-hidden
├── AsideNav（w-56，黑底，Logo + 导航 + 用户）
└── flex flex-col flex-1
    ├── HeaderNav（sticky，Search + 发布按钮）
    └── main（overflow-y-auto，内容区）
```

## Prisma 规则

- **写接口前先读 `prisma/schema.prisma`**
- Prisma client 生成到 `src/generated/prisma`，从 `@/generated/prisma/client` 导入类型
- 用 `Prisma.ModelGetPayload<{ select/include: ... }>` 定义类型
- `Post.likes` 是关联（`Like[]`），数字用 `Post.likeCount`
- `Post.comments` 是数字，数组用 `Post.commentList`
- Like 有 `@@unique([userId, postId])`，用 `upsert` 防重复
- 操作 Like/Comment 时，在同一事务里同步 denormalized 计数字段

## 验证

```bash
npx tsc --noEmit    # 每次改完必跑
```

## Things To Avoid

- 不要手动编辑 `src/generated/prisma`
- 不要新增 `middleware.ts`
- 不要在组件里硬编码颜色，使用主题 token
- 不要在 Client Component 里直接调 `lib/dal/*`，走 `lib/actions/*`
- 不要在 `lib/actions/*` 里直接 import prisma，通过 `lib/dal/*` 操作数据库
- 不要把 `pageNo` 写入 URL，无限滚动页码只存客户端 ref
- 不要在未经确认的情况下执行 seed 或 migrate
- 不要把敏感字段（password、phone）写入 JWT 或客户端 context
- 不要调用 `prismaGetLoginUser()` 只为拿 userId，用 `verifyAuth()` 代替

## Tailwind className 书写顺序

按以下顺序排列 className，保持一致性：

1. 宽高（`w-*`、`h-*`、`min-w-*`、`max-h-*` 等）
2. 字体（`text-*`、`font-*`、`leading-*`、`tracking-*`）
3. Padding（`p-*`、`px-*`、`py-*`、`pt-*` 等）
4. Margin（`m-*`、`mx-*`、`my-*`、`mt-*` 等）
5. Flex / Grid（`flex`、`grid`、`items-*`、`justify-*`、`gap-*`、`col-span-*` 等）
6. 其他（定位、颜色、边框、圆角、阴影、过渡等）
