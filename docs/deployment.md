# 部署说明

## 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建：

```bash
npm run build
```

启动生产构建：

```bash
npm run start
```

代码检查：

```bash
npm run lint
```

## 环境变量

项目依赖以下环境变量。

### 数据库

```env
DATABASE_URL="postgresql://..."
```

Prisma datasource 使用 PostgreSQL。具体变量名需结合 `prisma.config.ts` 和运行环境确认。

### JWT

```env
JWT_SECRET="your-secret"
```

用途：

- 签发和校验登录 JWT。
- 未配置时认证相关逻辑会抛错。

### 阿里云 OSS

```env
OSS_REGION="oss-cn-..."
OSS_ACCESS_KEY_ID="..."
OSS_ACCESS_KEY_SECRET="..."
OSS_BUCKET="..."
OSS_BASE_URL="https://..."
```

用途：

- 生成 OSS 预签名上传地址。
- 返回公开访问 URL。

### AI 服务

```env
DEEPSEEK_API_KEY="..."
DEEPSEEK_BASE_URL="..."
DEEPSEEK_MODEL="..."
```

实际变量名需以 `app/_lib/ai/deepseek.ts` 中读取逻辑为准。

## 数据库迁移

Prisma Schema：

```text
prisma/schema.prisma
```

迁移目录：

```text
prisma/migrations
```

常用命令：

```bash
npx prisma migrate dev
npx prisma migrate deploy
npx prisma generate
```

注意：

- 当前项目使用 Prisma 7，并将 Prisma Client 输出到 `generated/prisma`。
- 部署前需要确认生成产物和运行环境一致。

## 静态资源与上传

当前本地上传接口会将文件写入：

```text
public/uploads
```

生产环境注意：

- Serverless 或容器环境的本地文件系统可能不可持久化。
- 建议生产环境统一使用 OSS 上传。
- `public/uploads` 适合本地开发或临时测试。

## HEIC 转换

`POST /api/convert-heic` 使用 macOS `sips` 命令。

部署限制：

- macOS 环境可用。
- Linux 环境通常不可用。
- 如果部署到 Vercel、Docker、Linux 云服务器，需要替换为跨平台图片转换方案。

## 构建风险

部署前建议检查：

- `JWT_SECRET` 是否配置。
- 数据库连接是否可用。
- Prisma Client 是否生成。
- OSS 环境变量是否完整。
- AI API Key 和模型配置是否可用。
- 上传接口是否已增加生产级安全限制。
- HEIC 转换是否适配目标运行环境。

## 推荐部署步骤

1. 配置生产环境变量。
2. 执行数据库迁移。
3. 生成 Prisma Client。
4. 执行构建。
5. 启动服务。
6. 验证登录、发帖、上传、AI 聊天、个人主页。

