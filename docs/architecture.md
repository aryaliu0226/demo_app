# Architecture

## Project Snapshot

- Framework: Next.js 16.2.6 App Router
- React: 19.2.4
- TypeScript: strict mode
- Styling: Tailwind CSS v4，主题 token 定义在 `ui/globals.css`
- Database: PostgreSQL，通过 Prisma 7 + `@prisma/adapter-pg` 访问
- Auth: cookie-based JWT，使用 `jose`、`bcryptjs`、`zod`

## Directory Responsibilities

```txt
app/
  login/                 登录/注册页面
  (dashboard)/           主应用布局、帖子、个人中心、YoYo AI
  posts/                 帖子详情、新建帖子、帖子布局
  api/                   上传、聊天、会话等 Route Handler
lib/
  auth.ts                JWT、Cookie、verifyAuth()、登录跳转工具
  prisma.ts              Prisma 单例
  dal/                   纯服务端 Prisma 查询与写入
  actions/               Server Actions，供 Client Component 调用
  ai/                    OpenAI / DeepSeek 服务封装
ui/
  globals.css            Tailwind v4 与全局主题 token
  aside/                 侧边栏
  header/                顶部导航
  login/                 登录表单
  post/                  帖子 UI
  profile/               个人资料 UI
  yoyoai/                AI 聊天 UI
config/                  fetch 与全局配置
prisma/                  schema、seed、migrations
```

## Auth Flow

1. 登录/注册入口通过 action 校验表单。
2. 已存在账号时校验密码；不存在时创建用户。
3. 登录成功后写入 httpOnly cookie `access_token`。
4. `verifyAuth()` 失败时跳转 `/login?redirect=<当前路径>`。
5. 当前路径由 `proxy.ts` 写入 `x-current-path` 响应头。

## Auth Function Choice

```txt
只需要 userId（写操作、鉴权） -> verifyAuth()
需要展示用户信息              -> prismaGetLoginUser()
```

## Data Flow

```txt
Client Component
  -> lib/actions/*       ('use server')
  -> lib/dal/*           Prisma 数据函数
  -> lib/prisma.ts       Prisma 单例
  -> PostgreSQL
```

- Server Component / layout 可以直接调用 `lib/dal/*`。
- Client Component 只能调用 `lib/actions/*`。
- `lib/actions/*` 不直接 import prisma。

## Layout

```txt
flex h-screen overflow-hidden
├── AsideNav（w-56，Logo + 导航 + 用户）
└── flex flex-col flex-1
    ├── HeaderNav（sticky，Search + 发布按钮）
    └── main（overflow-y-auto，内容区）
```

## Next.js Constraint

- 使用 Next.js 16 的 `proxy.ts`。
- 不要新增 `middleware.ts`。
