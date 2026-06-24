# Agent Guide

## Priority

1. 遵守用户当前请求，不扩大修改范围。
2. 先读 `CLAUDE.md`，再按任务读取 `docs/`、`skills/`、`hooks/`、`mcp/` 中的对应规范。
3. 不改业务无关文件；用户要求只改规范时，不触碰 `app/`、`lib/`、`ui/`、`prisma/` 等代码目录。

## Project Entry

- 项目总入口：`CLAUDE.md`
- 架构规范：`docs/architecture.md`
- 数据库规范：`docs/database.md`
- API 规范：`docs/api.md`
- Next.js 技能：`skills/nextjs.md`
- Prisma 技能：`skills/prisma.md`
- PostgreSQL 技能：`skills/postgresql.md`
- UI 设计技能：`skills/ui-design.md`
- 分页 Hook 规范：`hooks/use-pagination.md`
- 上传 Hook 规范：`hooks/use-upload.md`
- 聊天 Hook 规范：`hooks/use-chat.md`
- MCP 规范：`mcp/`

## Safety Rules

- 涉及数据库前必须读 `prisma/schema.prisma`。
- 不要执行 seed、migrate、删除数据、重置数据库，除非用户明确确认。
- 不要新增 `middleware.ts`，Next.js 16 请求拦截入口是 `proxy.ts`。
- 不要手动编辑生成文件。
- 不要把敏感字段写入 JWT、日志、客户端 context 或 AI 请求上下文。
