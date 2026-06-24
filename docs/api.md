# API

## Server Actions

- Client Component 调用 `lib/actions/*`。
- Server Actions 负责输入校验、鉴权、调用 DAL、返回客户端需要的数据。
- 输入校验使用项目已有的 `zod` 模式或同风格校验。
- 不要在 action 中直接 import prisma。

## DAL

- DAL 文件位于 `lib/dal/*`。
- DAL 函数只处理服务端数据访问，不写 UI 状态逻辑。
- 新增查询或写入时，函数命名保持 `prismaXxx`。

## Auth

- 只需要 `userId`：调用 `verifyAuth()`。
- 需要当前用户展示信息：调用 `prismaGetLoginUser()`。
- 鉴权失败跳转使用 `/login?redirect=<当前路径>`。
- 不要把 password、phone 写入 JWT 或客户端 context。

## API Routes

- Route Handler 位于 `app/api/*/route.ts`。
- 上传、预签名、HEIC 转换、聊天接口保持各自职责单一。
- 接口返回结构应稳定，避免客户端依赖临时字段。

## Chat API

- AI 服务封装在 `lib/ai/*`。
- 聊天业务数据访问放在 `lib/dal/chat.ts`。
- 会话接口位于 `app/api/chat/session/route.ts`。
- 不要把敏感用户字段传给模型。
