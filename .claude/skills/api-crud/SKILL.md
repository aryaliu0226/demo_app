---
name: api-crud
description: 为此 Next.js 项目中的 Prisma model 生成增、删、改、查 CRUD 代码。当用户要求新增 model CRUD、server actions、DAL 函数、接口式数据操作，或为某个 Prisma model 创建模块文件时使用此 skill。此 skill 强制遵循项目约定：CRUD 顺序为增/删/改/查，文件以模块名命名，业务逻辑与参数校验放入 app/_lib/actions，Prisma 操作与数据类型导出放入 app/_lib/dal，且 DAL 中 type 必须定义在使用它的方法前面。
---

# API CRUD

使用此 skill 为本项目中的 Prisma model 对象生成 CRUD 代码。

本项目把 model 操作拆分到两个文件中：

- `app/_lib/actions/<module>.ts`：业务逻辑、参数解析、参数校验、action state、鉴权流程、缓存失效和跳转。
- `app/_lib/dal/<module>.ts`：Prisma 操作、数据库事务、依赖数据库状态的存在性或归属校验，以及数据类型导出。

两个文件都以模块名命名，例如 `post.ts`、`pet.ts`、`profile.ts` 或 `order.ts`。

## 编辑前检查

1. 先阅读 `app/_lib/actions` 和 `app/_lib/dal` 中相近模块的示例。
2. 阅读 `prisma/schema.prisma`，确认准确的 model 名称、标量字段、关联关系、唯一约束和删除行为。
3. 从用户请求或 Prisma model 名推导模块名。默认使用项目现有的小写模块命名风格，除非项目已有不同命名。
4. 创建文件前先检查文件是否已存在。若文件已存在，在原文件中扩展，不要破坏无关函数。

## CRUD 顺序

在可行的位置都按以下顺序书写 CRUD：

1. 增
2. 删
3. 改
4. 查

新建文件时，将此顺序应用到 imports、schemas、types、action 函数、DAL 函数和 exports。编辑已有文件时，优先保持局部可读性，但新增 CRUD 代码块仍按此顺序组织。

## Actions 层

业务逻辑和参数校验放在 `app/_lib/actions/<module>.ts`。

Actions 层负责：

- 按照已有 server action 文件风格添加 `'use server'`。
- 使用 `zod` 或项目已有的校验方式。
- 解析 `FormData`、路由参数、id、query string、boolean、array、date、分页和排序输入。
- 根据 Prisma schema，把空字符串规范化为 `undefined` 或 `null`。
- 当操作与用户相关时，调用 `verifyAuth()` 或类似鉴权 helper。
- 调用 DAL 函数，例如 `prismaCreate<Module>`、`prismaDelete<Module>`、`prismaUpdate<Module>`、`prismaGet<Module>`。
- 返回 action state 类型，例如 `Create<Module>State`、`Delete<Module>State`、`Update<Module>State`。
- 将 DAL 抛出的错误转换成面向用户的错误信息。
- 按附近代码习惯调用 `revalidatePath`、`redirect` 或其它缓存/导航 helper。

Actions 中不要直接写 Prisma 调用。凡是需要访问数据库的逻辑，都放到 DAL，再由 action 调用。

## DAL 层

Prisma 操作和数据类型导出放在 `app/_lib/dal/<module>.ts`。

DAL 层负责：

- 从生成的 Prisma client 导入 `Prisma`，并从 `app/_lib/prisma` 导入 `prisma`。
- 使用 `Prisma.<Model>GetPayload` 导出数据类型。
- 导出可复用的 input/query/result 类型，例如 `Create<Module>Input`、`Update<Module>Input`、`<Module>Query`、`<Module>ListItem`、`<Module>Detail`。
- 每个 type 必须定义在使用它的 DAL 方法前面。例如 `Create<Module>Input` 放在 `prismaCreate<Module>` 前，`<Module>Query` 放在 `prismaGet<Module>List` 前。
- 执行 `prisma.<model>.create`、`delete`、`deleteMany`、`update`、`findMany`、`findUnique`、`count` 和 `$transaction`。
- 构建带类型的 `where`、`select`、`include`、`orderBy`、`skip`、`take` 对象。
- 当校验依赖数据库状态时，在 DAL 中检查存在性、归属关系、关联有效性和冗余计数一致性。

DAL 中不要放 `zod`、`FormData` 解析、跳转、revalidation 或 UI 专用 action state。

## 函数命名

除非目标模块已经有既定命名，否则使用以下名称。

增：

- Action：`create<Module>Action`
- DAL：`prismaCreate<Module>`
- 类型：`Create<Module>Input`、`Create<Module>State`

删：

- Action：`delete<Module>Action`
- DAL：`prismaDelete<Module>`
- 类型：如果 action 返回结构化状态，使用 `Delete<Module>State`

改：

- Action：`update<Module>Action`
- DAL：`prismaUpdate<Module>`
- 类型：`Update<Module>Input`、`Update<Module>State`

查：

- Action：`fetch<Module>Action`、`fetch<Module>ListAction` 或 `fetch<Module>DetailAction`
- DAL：`prismaGet<Module>`、`prismaGet<Module>List` 或 `prismaGet<Module>Detail`
- 类型：`<Module>`、`<Module>Detail`、`<Module>Query`

## 新增指导

Actions 中：

- 校验必填字段。
- 调用 DAL 前规范化可选值。
- 用户可见错误信息保留在 action 中。
- 仅在 DAL 调用成功后 revalidate 或 redirect。

DAL 中：

- 接收带类型的 input 对象。
- 认证用户 id 放在哪一层取决于项目现有模式。如果附近 DAL 函数调用 `verifyAuth()`，就沿用该模式；否则从 action 传入 user id。
- 按调用方 UI 需要 include 关联数据。

## 删除指导

Actions 中：

- 调用 DAL 前校验 id。
- 如果附近代码在 actions 中鉴权，则在 action 中鉴权。
- 捕获 DAL 错误并返回简洁错误信息。

DAL 中：

- 检查记录是否存在。
- 对用户私有数据检查归属权。
- 删除关联数据或维护计数时使用 `$transaction`。
- 根据现有 schema 和附近模块行为选择硬删除或软删除；无法推断时再询问用户。

## 修改指导

Actions 中：

- 校验 id 和可编辑字段。
- 当空更新会掩盖客户端问题时，拒绝空更新。
- 明确规范化 nullable 字段。
- 不要传入用户无权编辑的字段。

DAL 中：

- 接收带类型的 update input。
- 在相关场景检查存在性和归属权。
- 避免覆盖未提交字段。
- 调用方需要时返回更新后的对象。

## 查询指导

Actions 中：

- 校验 id、分页、过滤条件、关键字和排序参数。
- 除非 UI 需要 action 专用包装，否则直接返回带类型的 DAL 结果。

DAL 中：

- 使用 `Prisma.<Model>WhereInput` 构建过滤条件。
- 排序优先使用 `Prisma.SortOrder`。
- 分页列表返回 `{ data, total }`。
- 根据查询键是否唯一，明确选择 `findUnique` 或 `findFirst`。

## 完成前检查

完成 CRUD 任务前确认：

- 文件位于 `app/_lib/actions/<module>.ts` 和 `app/_lib/dal/<module>.ts`。
- 模块文件名与模块名一致。
- CRUD 按增、删、改、查排序。
- 参数校验和业务逻辑位于 actions。
- Prisma 操作和导出的数据类型位于 DAL。
- DAL 中每个 type 都定义在使用它的方法前面。
- actions 从 DAL 导入类型时尽量使用 `type` import。
- 代码风格符合附近项目代码，包括分号、引号、路径别名、错误信息、鉴权、revalidation 和 redirect。
- 可用时已运行项目 formatter、linter、typecheck 或 build。
