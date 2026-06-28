# 接口说明

## 页面路由

| 路由 | 权限 | 说明 |
| --- | --- | --- |
| `/` | 公开 | 首页 |
| `/login` | 公开 | 登录/自动注册 |
| `/posts` | 公开 | 帖子列表 |
| `/posts/new` | 登录 | 发布帖子 |
| `/posts/[id]` | 公开 | 帖子详情 |
| `/profile` | 登录 | 个人主页 |
| `/yoyoai` | 登录 | YoYo AI 新会话页 |
| `/yoyoai/[id]` | 登录 | YoYo AI 会话详情 |

## API Routes

### POST /api/chat/session

创建 AI 会话。

权限：

- 需要登录。

请求体：

```json
{
  "message": "猫咪换粮要注意什么？"
}
```

限制：

- `message` 必填。
- 最多 2000 字。

响应：

```json
{
  "sessionId": "uuid"
}
```

### POST /api/chat

发送 AI 消息并获取流式回复。

权限：

- 需要登录。
- `sessionId` 必须属于当前用户。

请求体：

```json
{
  "sessionId": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "猫咪换粮要注意什么？"
    }
  ]
}
```

限制：

- `sessionId` 必须是 UUID。
- `messages` 最少 1 条，最多 20 条。
- `role` 只能是 `user` 或 `assistant`。
- 单条 `content` 最多 2000 字。

响应：

- 成功时返回 `text/plain; charset=utf-8` 文本流。
- 失败时返回 JSON 错误。

常见错误：

- `401`：请先登录后再使用 YoYo。
- `400`：请求参数错误。
- `404`：会话不存在。
- `429`：请求太频繁。
- `500/503`：AI 服务异常或繁忙。

### POST /api/upload

上传文件到本地 `public/uploads`。

请求：

- `FormData`
- 字段：`file`

响应：

```json
{
  "url": "/uploads/example.jpg"
}
```

当前限制：

- 未发现登录校验。
- 未发现文件大小限制。
- 未发现 MIME 类型限制。

### POST /api/presign

生成阿里云 OSS 预签名上传 URL。

请求体：

```json
{
  "fileName": "cat.jpg",
  "fileType": "image/jpeg"
}
```

响应：

```json
{
  "uploadUrl": "https://...",
  "publicUrl": "https://..."
}
```

当前限制：

- 未发现登录校验。
- 预签名有效期为 60 秒。
- 文件 key 格式为 `uploads/{timestamp}-{fileName}`。

### POST /api/convert-heic

将 HEIC/HEIF 文件转换为 JPEG。

请求：

- `FormData`
- 字段：`file`

响应：

- 成功时返回 `image/jpeg`。
- 失败时返回 JSON 错误。

实现说明：

- 使用 macOS 内置 `sips` 命令。
- 临时文件写入系统临时目录。
- 转换完成后清理临时文件。

部署注意：

- Linux 环境通常没有 `sips`，需要替换实现。

## Server Actions

### fetchLoginAction

登录或自动注册。

入参：

- `account`：必填，最多 32 位。
- `password`：必填，6 到 64 位。

行为：

- 账号存在时校验密码。
- 账号不存在时创建用户。
- 成功后写入登录 Cookie 并跳转。

### createPostAction

创建帖子。

权限：

- 需要登录。

字段：

- `title`：必填，最多 100 字。
- `bref`：可选，最多 300 字。
- `categoryId`：可选。
- `published`：可选。
- `pictures`：可选，数组。
- `video`：可选。

### deletePostAction

删除帖子。

权限：

- 需要登录。
- 仅作者本人可删除。

行为：

- 删除点赞。
- 删除收藏。
- 扣减作者获赞数。
- 删除评论。
- 删除帖子。

### togglePostLikeAction

切换点赞状态。

权限：

- 需要登录。

响应：

```ts
{
  liked: boolean
  likeCount: number
  authorStars: number
}
```

### togglePostFavoriteAction

切换收藏状态。

权限：

- 需要登录。

响应：

```ts
{
  favorited: boolean
  stars: number
}
```

### toggleFollowAction

切换关注状态。

行为：

- 未登录时返回登录跳转地址。
- 不能关注自己。
- 已关注时取消关注。
- 未关注时新增关注。

### updateProfileAction

更新个人资料。

权限：

- 需要登录。

字段：

- `nickname`：最多 20 字。
- `brief`：最多 200 字。
- `avatar`：可选。
- `gender`：`男` 或 `女`。
- `birthday`：日期字符串。

### createPetAction

创建宠物档案。

字段：

- `name`：必填，最多 20 字。
- `birthDate`：必填，格式 `YYYY-MM-DD`。
- `categoryId`：必填。
- `avatar`：可选。

校验：

- 出生日期必须合法。
- 出生日期不能晚于今天。
- 年龄不能超过 99。

### fetchChatSessionsAction

获取当前用户 AI 会话列表。

权限：

- 需要登录。

### deleteChatSessionAction

删除 AI 会话。

权限：

- 需要登录。
- 只能删除自己的会话。

