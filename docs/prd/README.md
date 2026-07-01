# PRD 版本管理

本目录用于管理 PRD v1.0 的开发状态和 Git 分支约定。当前阶段只考虑 v1.0，所有已列出的功能均归入 v1.0 完成范围。

## 版本索引

| PRD 版本 | 文档 | 状态 | 基线分支/Tag | 版本分支 | 开发分支 | 状态文档 | 说明 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| v1.0 | [../prd1.0.md](../prd1.0.md) | 已冻结 / 开发中 | `main` | `v1.0` | `dev/v1.0` | [v1.0-status.md](./v1.0-status.md) | 当前 AI 开发基准版本 |

## 状态说明

| 状态 | 含义 |
| --- | --- |
| 评审中 | 需求进入讨论确认阶段 |
| 已冻结 | 需求范围确定，可交给 AI 或开发者实现 |
| 开发中 | 已创建开发分支或已有代码改动 |
| 验收中 | 功能已完成，等待验收 |
| 已发布 | 已上线并打发布 Tag |
| 已废弃 | 版本或需求取消 |

## v1.0 工作流

### 分支结构

```text
main
└── v1.0
    └── dev/v1.0
        ├── feat/v1.0-post-comments
        ├── feat/v1.0-ai-token-limit
        └── fix/v1.0-upload-security
```

规则：

- `v1.0` 对应 PRD v1.0 的版本集成/验收分支。
- `dev/v1.0` 是 v1.0 日常开发集成分支。
- 具体功能从 `dev/v1.0` 切出 `feat/v1.0-*` 或 `fix/v1.0-*`。
- 功能完成后先合回 `dev/v1.0`。
- 阶段验收通过后，`dev/v1.0` 合入 `v1.0`。
- v1.0 上线后打 `v1.0.0` Tag，并将 `v1.0` 合回 `main`。
- v1.0 开发中如必须变更需求，应新增 `v1.0.x` 补丁说明，而不是静默修改 `prd1.0.md`。

## Git 分支命名

| 类型 | 命名规则 | 示例 |
| --- | --- | --- |
| 版本分支 | `v{major}.{minor}` | `v1.0` |
| 版本开发分支 | `dev/v{major}.{minor}` | `dev/v1.0` |
| 功能分支 | `feat/v{major}.{minor}-{module}-{feature}` | `feat/v1.0-post-comments` |
| 修复分支 | `fix/v{major}.{minor}-{module}-{issue}` | `fix/v1.0-ai-token-limit` |

## Commit 规范

```text
<type>(<module>): <summary>

Refs: PRD v<version> / <feature>
```

示例：

```text
feat(post): add comment submission

Refs: PRD v1.0 / Post 评论发布
```

常用 `type`：

| 类型 | 含义 |
| --- | --- |
| feat | 新功能 |
| fix | 缺陷修复 |
| docs | 文档更新 |
| refactor | 重构 |
| test | 测试 |
| chore | 构建、依赖或杂项 |

## AI 开发指令模板

开发 v1.0 指令：

```text
按照 docs/prd1.0.md 和 docs/prd/v1.0-status.md 开发 PRD v1.0。
只实现状态为“待开发”的 v1.0 功能。
从 dev/v1.0 切对应功能分支，完成后更新 v1.0-status.md。
```

继续处理 P0 指令：

```text
查看 docs/prd/v1.0-status.md，开发所有 PRD v1.0、P0、状态为“待开发”的功能。
每个功能独立分支提交，Commit 信息遵循 docs/prd/README.md 的规范。
```
