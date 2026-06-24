# Claude Project Guide

## Read First

- 这是 Next.js 16.2.6 App Router 项目，React 19.2.4，TypeScript strict mode。
- Next.js 16 使用 `proxy.ts` 代替 `middleware.ts`，不要新增 `middleware.ts`。
- 涉及数据库、Prisma、接口、Server Action 前，先读 `prisma/schema.prisma`，以当前 schema 为准。
- 不要手动编辑生成代码、迁移历史或业务无关文件。

## Guide Map

```txt
docs/
  architecture.md     项目架构、目录职责、认证流程、布局结构
  database.md         数据库模型、Prisma 分层、计数字段规则
  api.md              Server Action、API Route、鉴权和上传接口约定

skills/
  nextjs.md           Next.js 16 / App Router 开发规则
  prisma.md           Prisma 7 使用规则
  postgresql.md       PostgreSQL 数据一致性规则
  ui-design.md        Tailwind v4 与 UI 设计规范

hooks/
  use-pagination.md   列表分页与无限滚动规范
  use-upload.md       上传与媒体处理规范
  use-chat.md         聊天会话与 AI 消息规范

mcp/
  github.md           GitHub MCP 使用边界
  postgres.md         PostgreSQL MCP 使用边界
  deepseek.md         DeepSeek / AI 服务使用边界
```

## Working Rules

- 先读相关规范，再改代码：架构读 `docs/architecture.md`，数据库读 `docs/database.md`，接口读 `docs/api.md`。
- Client Component 只能调用 `lib/actions/*`；Server Component / layout 可以直接调用 `lib/dal/*`。
- `lib/actions/*` 不直接 import prisma，必须通过 `lib/dal/*`。
- 新增数据库操作时，先在 `lib/dal/` 写 `prismaXxx`，再在 `lib/actions/` 暴露 `xxxAction`。
- 只需要 `userId` 时用 `verifyAuth()`；需要展示用户信息时用 `prismaGetLoginUser()`。
- 不要把敏感字段（password、phone）写入 JWT 或客户端 context。
- 不要在未经用户确认的情况下执行 seed、migrate 或破坏性数据库操作。

## Common Commands

```bash
npm run dev
npm run build
npx tsc --noEmit
npx tsx prisma/seed.ts
```

- 改完 TypeScript 代码必须跑 `npx tsc --noEmit`。
- `seed`、`migrate` 只能在用户明确确认后执行。

## Things To Avoid

- 不要新增 `middleware.ts`。
- 不要手动编辑 `generated/` 或 Prisma 生成产物。
- 不要在组件里硬编码颜色，使用主题 token。
- 不要把无限滚动的 `pageNo` 写入 URL。
- 不要调用 `prismaGetLoginUser()` 只为拿 `userId`。
