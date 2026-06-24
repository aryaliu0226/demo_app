# PostgreSQL Skill

## Consistency

- 以事务保证多表写入一致性。
- denormalized 计数字段必须和真实关联变更同步。
- 唯一约束用于防止重复业务关系，例如用户对同一帖子的 Like。

## Safety

- 未经用户确认，不执行破坏性 SQL。
- 未经用户确认，不执行 migrate、reset、seed。
- 不在日志、错误信息或 AI 上下文中暴露连接串、密码或个人敏感字段。

## Query Design

- 优先让 Prisma 表达查询意图。
- 需要分页时使用稳定排序。
- 需要搜索时保持参数化查询，不拼接用户输入为 SQL。
