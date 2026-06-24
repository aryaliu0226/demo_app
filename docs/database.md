# Database

## Source Of Truth

- 数据库结构以 `prisma/schema.prisma` 为准。
- 每次涉及数据库相关代码前，必须先读 `prisma/schema.prisma`。
- 不要根据旧代码、文件名或记忆推断字段。

## Prisma Client

- Prisma client 输出在 `generated/prisma`，视为生成代码，不手动编辑。
- 类型从项目现有导入路径读取，保持与现有代码一致。
- 复杂返回类型优先用 `Prisma.ModelGetPayload<{ select/include: ... }>`。

## Layering

```txt
lib/actions/*  ->  lib/dal/*  ->  lib/prisma.ts  ->  PostgreSQL
```

- `lib/dal/*`：直接操作 Prisma，函数命名 `prismaXxx`。
- `lib/actions/*`：给客户端调用，函数命名 `fetchXxxAction`、`updateXxxAction` 或项目已有同类命名。
- `lib/actions/*` 不直接 import prisma。

## Post Rules

- `Post.likes` 是关联数组。
- 数字点赞数使用 `Post.likeCount`。
- `Post.comments` 是计数字段。
- 评论数组使用 `Post.commentList`。
- Like 有 `@@unique([userId, postId])`，使用 `upsert` 防重复。
- 操作 Like / Comment 时，在同一事务里同步 denormalized 计数字段。

## Safety

- 不要在未经用户确认的情况下执行 seed、migrate、reset、truncate、delete all。
- 不要把 password、phone 等敏感字段返回到客户端 context。
- 写入接口必须先鉴权。
