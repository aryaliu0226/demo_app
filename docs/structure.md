# 项目结构

## 根目录结构

```text
.
├── app/                  # Next.js App Router 页面、组件、API、业务库
├── docs/                 # 项目文档
├── generated/            # Prisma 生成产物
├── prisma/               # Prisma Schema、迁移和 seed
├── public/               # 静态资源和本地上传文件
├── package.json          # 项目依赖和脚本
├── next.config.ts        # Next.js 配置
├── tsconfig.json         # TypeScript 配置
├── eslint.config.mjs     # ESLint 配置
├── components.json       # UI 组件配置
└── proxy.ts              # 请求代理/路径头处理
```

## app 目录结构

```text
app/
├── (dashboard)/          # 登录后主应用布局下的页面
│   ├── layout.tsx
│   ├── posts/page.tsx
│   ├── profile/page.tsx
│   └── yoyoai/
├── posts/                # 公开帖子页面
│   ├── layout.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── login/                # 登录页
├── api/                  # API Routes
├── _components/          # 业务和基础组件
├── _lib/                 # 认证、DAL、actions、AI、上传等服务代码
├── _config/              # 全局配置
├── layout.tsx            # 根布局
├── page.tsx              # 首页
├── globals.css           # 全局样式
├── loading.tsx           # 全局加载页
├── error.tsx             # 全局错误页
└── not-found.tsx         # 404 页面
```

## 页面路由

| 路由 | 文件 | 说明 |
| --- | --- | --- |
| `/` | `app/page.tsx` | 首页 |
| `/login` | `app/login/page.tsx` | 登录/自动注册 |
| `/posts` | `app/(dashboard)/posts/page.tsx` | 帖子列表 |
| `/posts/new` | `app/posts/new/page.tsx` | 发布帖子，需要登录 |
| `/posts/[id]` | `app/posts/[id]/page.tsx` | 帖子详情 |
| `/profile` | `app/(dashboard)/profile/page.tsx` | 个人主页 |
| `/yoyoai` | `app/(dashboard)/yoyoai/page.tsx` | YoYo AI 新会话页 |
| `/yoyoai/[id]` | `app/(dashboard)/yoyoai/[id]/page.tsx` | YoYo AI 会话详情 |

## 组件目录

```text
app/_components/
├── aside/                # 侧边导航
├── header/               # 顶部导航
├── icon/                 # 图标组件
├── login/                # 登录表单
├── post/                 # 帖子列表、卡片、发布、媒体、互动
├── profile/              # 个人资料、宠物、个人主页标签页
├── yoyoai/               # AI 会话、消息、输入框
├── AppLogo.tsx
├── Avatar.tsx
├── FollowButton.tsx
├── Search.tsx
└── ...
```

说明：

- `post` 负责帖子展示、发布、媒体上传和互动按钮。
- `profile` 负责用户资料、宠物档案和个人内容标签页。
- `yoyoai` 同时存在于 `app/_components/yoyoai` 和 `app/(dashboard)/yoyoai/_components`，后续建议统一组件来源，减少重复维护。

## 业务库目录

```text
app/_lib/
├── actions/              # Server Actions
├── ai/                   # AI 客户端配置
├── dal/                  # 数据访问层
├── auth.ts               # 登录态、JWT、Cookie、鉴权
├── prisma.ts             # Prisma Client
├── text-codec.ts         # 文本编码工具
└── upload.ts             # 上传相关工具
```

### Server Actions

- `actions/login.ts`：登录和自动注册。
- `actions/post.ts`：帖子查询、创建、删除、点赞、收藏。
- `actions/profile.ts`：资料更新和个人内容查询。
- `actions/pet.ts`：宠物分类、宠物列表、创建宠物。
- `actions/follow.ts`：关注切换。
- `actions/chat.ts`：AI 会话列表和删除。

### DAL

- `dal/user.ts`：用户查询。
- `dal/login.ts`：用户创建。
- `dal/post.ts`：帖子、分类、点赞、收藏、删除事务。
- `dal/profile.ts`：个人资料和个人内容。
- `dal/pet.ts`：宠物与宠物分类。
- `dal/follow.ts`：关注关系。
- `dal/chat.ts`：AI 会话和消息。

## 代码组织建议

- 页面只组合数据和组件，复杂业务放到 action/API。
- 数据库访问集中在 DAL，事务逻辑不要散落在组件中。
- 共享组件统一放 `app/_components`，避免重复目录长期并存。
- 上传、AI、鉴权等跨模块能力放 `app/_lib`。
- Prisma 模型变更后同步更新 `docs/database.md`。

