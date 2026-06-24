# DeepSeek MCP

## Scope

- 用于 AI 服务调试、模型请求结构检查和响应分析。
- 项目内 DeepSeek 封装位于 `lib/ai/deepseek.ts`。

## Rules

- 不向模型发送 password、phone、token、数据库连接串或私密日志。
- prompt、messages、tools 结构应在服务端封装，客户端不直接拼敏感上下文。
- 调试模型输出时保留最小必要上下文。
- 与聊天业务相关的持久化仍通过 `lib/dal/chat.ts` 和 API / action 完成。
