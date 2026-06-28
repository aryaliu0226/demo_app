# 技术架构

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 应用框架 | Next.js 16 App Router |
| 视图层 | React 19 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 4、Ant Design 6 |
| 数据库 | PostgreSQL |
| ORM | Prisma 7 |
| 认证 | JWT、HttpOnly Cookie、jose |
| 密码哈希 | bcryptjs |
| AI 调用 | OpenAI SDK 兼容客户端、DeepSeek |
| Markdown 渲染 | react-markdown、remark-gfm、rehype-sanitize |
| 对象存储 | 阿里云 OSS |
| 图片处理 | sharp、HEIC 转换接口 |
| 校验 | zod |

## 应用分层

```text
Page / Layout
  -> Component
  -> Server Action / API Route
  -> DAL
  -> Prisma Client
  -> PostgreSQL
```

主要分层：

- 页面层：负责路由、页面组合和服务端鉴权。
- 组件层：负责 UI 展示和客户端交互。
- Server Actions：负责表单提交、业务写入、缓存刷新和跳转。
- API Routes：负责 AI 流式响应、上传、OSS 预签名、HEIC 转换等 HTTP 能力。
- DAL：集中封装 Prisma 查询、事务和数据写入。
- Prisma Schema：定义数据库模型和关系。

## 认证设计

- 登录成功后生成 JWT。
- JWT 通过 `access_token` 写入 HttpOnly Cookie。
- Cookie 配置：
  - `httpOnly: true`
  - 生产环境 `secure: true`
  - `sameSite: lax`
  - 有效期 24 小时
  - 路径 `/`
- `verifyAuth` 用于强制登录，不合法时跳转登录页。
- `getOptionalUserId` 用于游客可访问但需要识别登录态的页面。
- `buildLoginRedirectUrl` 用于生成带回跳参数的登录地址。

## 内容与缓存

- 帖子列表通过 DAL 支持分页、关键词和分类筛选。
- 创建帖子后刷新 `/posts`。
- 删除帖子后刷新 `/posts` 和 `/profile`。
- 点赞和收藏后刷新帖子详情与个人主页。
- AI 会话变化后刷新 `/yoyoai` layout。

## 媒体上传架构

当前存在三类媒体能力：

- 本地上传：`POST /api/upload` 写入 `public/uploads`。
- OSS 预签名：`POST /api/presign` 返回 `uploadUrl` 和 `publicUrl`。
- HEIC 转换：`POST /api/convert-heic` 调用 macOS `sips` 将 HEIC/HEIF 转为 JPEG。

建议：

- 生产环境优先使用 OSS 或 CDN，不依赖本地 public 写入。
- 上传接口增加鉴权、文件大小限制、MIME 校验和扩展名白名单。
- HEIC 转换部署到 Linux 时改用跨平台库或独立转换服务。

## AI 架构

YoYo AI 使用流式接口：

1. 用户创建会话或进入已有会话。
2. 服务端校验登录态。
3. 服务端校验会话归属，避免跨用户访问。
4. 将系统提示词和上下文消息发送给 AI 服务。
5. 服务端以 `ReadableStream` 返回文本流。
6. 回复完成后保存 assistant 消息。

约束：

- 单条消息最多 2000 字。
- 单次请求最多携带 20 条上下文消息。
- 系统提示词限定 AI 专注宠物话题。

## 安全设计

已实现：

- 密码 bcrypt 哈希。
- HttpOnly Cookie 存储登录态。
- 登录页支持回跳。
- 受保护页面强制登录。
- AI 会话归属隔离。
- 删除帖子校验作者身份。
- 点赞和收藏使用唯一约束避免重复。

建议补充：

- 上传接口鉴权和频率限制。
- OSS 预签名接口鉴权。
- CSRF 防护策略。
- AI 聊天和发帖限流。
- 内容安全审核。
- 生产环境密钥管理。

