# Chat Hook

## Responsibilities

- 聊天 UI 状态、消息追加、发送中状态、错误状态可以封装为 hook。
- 会话持久化逻辑放在服务端 DAL / API 中。
- 模型调用封装在 `lib/ai/*`。

## Existing Files

- AI 服务：`lib/ai/openAi.ts`、`lib/ai/deepseek.ts`
- 聊天 DAL：`lib/dal/chat.ts`
- 聊天 action：`lib/actions/chat.ts`
- 聊天 API：`app/api/chat/route.ts`
- 会话 API：`app/api/chat/session/route.ts`
- 聊天 UI：`ui/yoyoai/*` 和 `app/(dashboard)/yoyoai/_components/*`

## Rules

- 不把 password、phone、token、连接串等敏感字段传给模型。
- 发送消息时处理 loading、失败重试、空内容校验。
- Markdown 渲染必须保持 sanitize。
- 会话列表和当前会话消息状态要分离，避免互相覆盖。
