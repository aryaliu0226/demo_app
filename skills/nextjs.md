# Next.js Skill

## Version

- 使用 Next.js 16.2.6 App Router。
- 不要套用 Pages Router 或旧版 middleware 规则。
- 请求拦截入口是 `proxy.ts`，不是 `middleware.ts`。

## Components

- 默认使用 Server Component。
- 需要浏览器状态、事件、effect、context consumer 时才加 `'use client'`。
- Client Component 不直接调用 `lib/dal/*`。
- Client Component 通过 `lib/actions/*` 或 API Route 获取数据。

## Routing

- 页面放在 `app/**/page.tsx`。
- 布局放在 `app/**/layout.tsx`。
- API Route 使用 `app/api/**/route.ts`。
- 错误、加载、404 使用 `error.tsx`、`loading.tsx`、`not-found.tsx`。

## Validation

```bash
npx tsc --noEmit
npm run build
```

- 改完 TypeScript 代码至少跑类型检查。
- 涉及路由、构建配置或 Server Component 行为时跑 build。
