# Prisma Skill

## Read Schema First

- 修改任何数据库读写前，先读 `prisma/schema.prisma`。
- schema 是唯一可信来源。

## Query Rules

- DAL 中直接使用 Prisma。
- Action 中不直接使用 Prisma。
- 返回给客户端的数据必须显式 select 或 include，避免泄露敏感字段。
- 类型优先从 Prisma payload 推导，减少手写结构漂移。

## Mutation Rules

- 写入前先鉴权。
- 需要同步多个表或计数字段时使用事务。
- Like 使用唯一约束配合 `upsert` 防重复。
- Comment / Like 计数字段与关联写入保持同事务一致。

## Generated Files

- 不手动编辑 `generated/`。
- 不手动改 migration 历史，除非用户明确要求处理迁移问题。
