# 数据模型

项目使用 PostgreSQL + Prisma。Schema 文件位于 `prisma/schema.prisma`，Prisma Client 输出到 `generated/prisma`。

## User - 用户

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| email | String? (unique) | 邮箱，可为空，唯一 |
| name | String? | 用户名称 |
| nickname | String? (unique) | 昵称，可为空，唯一 |
| avatar | String? | 用户头像 URL |
| phone | String? (unique) | 手机号，可为空，唯一 |
| password | String | bcrypt 哈希密码，默认空字符串 |
| account | String (unique) | 登录账号，唯一 |
| age | Int? | 年龄，默认 0 |
| address | String? | 地址，默认空字符串 |
| brief | String? | 个人简介，默认空字符串 |
| followerCount | Int | 粉丝数，默认 0 |
| followingCount | Int | 关注数，默认 0 |
| stars | Int | 作者累计获赞数，默认 0 |
| birthday | DateTime? | 生日 |
| gender | String? | 性别，默认空字符串 |
| comments | Comment[] | 用户发布的评论 |
| chatSessions | ChatSession[] | 用户的 AI 会话 |
| favorites | Favorite[] | 用户收藏记录 |
| likes | Like[] | 用户点赞记录 |
| pets | Pet[] | 用户宠物档案 |
| posts | Post[] | 用户发布的帖子 |
| roles | UserRole[] | 用户角色关联 |
| follows | User[] | 用户关注关系 |
| following | User[] | 用户被关注关系 |

## Role - 角色

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| name | String (unique) | 角色标识，唯一 |
| label | String | 角色展示名称 |
| description | String? | 角色描述 |
| createdAt | DateTime | 创建时间，默认当前时间 |
| updatedAt | DateTime | 更新时间，自动更新 |
| permissions | RolePermission[] | 角色权限关联 |
| users | UserRole[] | 用户角色关联 |

## Permission - 权限

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| key | String (unique) | 权限标识，唯一 |
| label | String | 权限展示名称 |
| description | String? | 权限描述 |
| createdAt | DateTime | 创建时间，默认当前时间 |
| updatedAt | DateTime | 更新时间，自动更新 |
| roles | RolePermission[] | 角色权限关联 |

## UserRole - 用户角色关联

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| userId | String | 用户 ID，联合主键 |
| roleId | String | 角色 ID，联合主键 |
| role | Role | 关联角色，角色删除时级联删除 |
| user | User | 关联用户，用户删除时级联删除 |

约束：

- `@@id([userId, roleId])`：同一用户不能重复绑定同一角色。

## RolePermission - 角色权限关联

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| roleId | String | 角色 ID，联合主键 |
| permissionId | String | 权限 ID，联合主键 |
| permission | Permission | 关联权限，权限删除时级联删除 |
| role | Role | 关联角色，角色删除时级联删除 |

约束：

- `@@id([roleId, permissionId])`：同一角色不能重复绑定同一权限。

## Post - 帖子

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| title | String | 帖子标题 |
| content | String? | 帖子正文 |
| published | Boolean | 发布状态，默认 false |
| authorId | String | 作者用户 ID |
| createdAt | DateTime | 创建时间，默认当前时间 |
| pictures | String[] | 图片 URL 列表 |
| stars | Int | 收藏数，默认 0 |
| updatedAt | DateTime | 更新时间，自动更新 |
| video | String? | 视频 URL |
| comments | Int | 评论数，默认 0 |
| likeCount | Int | 点赞数，默认 0 |
| categoryId | String? | 宠物分类 ID |
| commentList | Comment[] | 评论列表 |
| favorites | Favorite[] | 收藏记录 |
| likes | Like[] | 点赞记录 |
| author | User | 帖子作者 |
| category | PetCategory? | 关联宠物分类 |

## Comment - 评论

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| content | String | 评论内容 |
| postId | String | 帖子 ID |
| authorId | String | 评论作者 ID |
| createdAt | DateTime | 创建时间，默认当前时间 |
| author | User | 评论作者 |
| post | Post | 所属帖子 |

## Like - 点赞

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| userId | String | 用户 ID |
| postId | String | 帖子 ID |
| createdAt | DateTime | 点赞时间，默认当前时间 |
| post | Post | 被点赞帖子 |
| user | User | 点赞用户 |

约束：

- `@@unique([userId, postId])`：同一用户对同一帖子只能点赞一次。

## Favorite - 收藏

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| userId | String | 用户 ID |
| postId | String | 帖子 ID |
| createdAt | DateTime | 收藏时间，默认当前时间 |
| post | Post | 被收藏帖子 |
| user | User | 收藏用户 |

约束：

- `@@unique([userId, postId])`：同一用户对同一帖子只能收藏一次。

## Pet - 宠物

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| name | String | 宠物名称 |
| age | Int | 年龄 |
| birthDate | DateTime? | 出生日期 |
| categoryId | String | 宠物分类 ID |
| avatar | String? | 宠物头像 URL |
| userId | String? | 所属用户 ID |
| status | Int | 状态，默认 1 |
| category | PetCategory | 宠物分类 |
| user | User? | 所属用户 |

## PetCategory - 宠物分类

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| label | String (unique) | 分类展示名，唯一 |
| name | String (unique) | 分类名称，唯一，默认空字符串 |
| pets | Pet[] | 该分类下的宠物 |
| posts | Post[] | 该分类下的帖子 |

## ChatSession - AI 会话

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| title | String | 会话标题，默认“新的对话” |
| userId | String | 所属用户 ID |
| createdAt | DateTime | 创建时间，默认当前时间 |
| updatedAt | DateTime | 更新时间，自动更新 |
| messages | ChatMessage[] | 会话消息列表 |
| user | User | 所属用户，用户删除时级联删除 |

索引：

- `@@index([userId, updatedAt])`：按用户和更新时间查询会话列表。

## ChatMessage - AI 消息

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | String (uuid) | 主键 |
| role | String | 消息角色，通常为 user / assistant |
| content | String | 消息内容 |
| sessionId | String | 会话 ID |
| createdAt | DateTime | 创建时间，默认当前时间 |
| session | ChatSession | 所属会话，会话删除时级联删除 |

索引：

- `@@index([sessionId, createdAt])`：按会话和时间查询消息列表。

## 模型关系

```text
User 1 - N Post
User 1 - N Pet
User 1 - N Comment
User 1 - N ChatSession
ChatSession 1 - N ChatMessage
Post 1 - N Comment
Post 1 - N Like
Post 1 - N Favorite
PetCategory 1 - N Pet
PetCategory 1 - N Post
User N - N User through UserFollows
User N - N Role through UserRole
Role N - N Permission through RolePermission
```

## 计数字段维护

| 字段 | 所属模型 | 维护规则 |
| --- | --- | --- |
| followerCount | User | 关注/取消关注时同步维护 |
| followingCount | User | 关注/取消关注时同步维护 |
| stars | User | 帖子被点赞/取消点赞时同步维护作者累计获赞数 |
| stars | Post | 收藏/取消收藏时同步维护 |
| likeCount | Post | 点赞/取消点赞时同步维护 |
| comments | Post | 评论创建/删除时同步维护 |

注意：

- 冗余计数字段需要通过事务维护，避免与关系表不一致。
- 删除帖子时需要同步清理 `Like`、`Favorite`、`Comment`，并扣减作者累计获赞数。
- 当前 RBAC 模型已具备数据结构，但页面和接口尚未完整接入权限控制。

