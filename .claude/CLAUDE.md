# Claude Project Guide

## 基本规则

- 先阅读并遵守 `.claude/agents/nextjs-agent.md`。
- 本项目使用 Next.js 16.2.6。这个版本里 Middleware 已更名为 Proxy，因此请求拦截入口只保留根目录的 `proxy.ts`，不要新增 `middleware.ts` 或 `middleware.*` 配置文件。
- 修改 App Router 相关代码前，优先查阅 `node_modules/next/dist/docs/` 中对应文档，避免沿用旧版 Next.js 约定。

## 项目目录

```txt
.
├── next.config.ts                 # Next.js 总配置文件
├── proxy.ts                       # 请求拦截 / 鉴权 / 重定向，Next 16 中替代 middleware.ts
├── .claude/
│   ├── CLAUDE.md                  # Claude 项目说明
│   └── agents/
│       └── nextjs-agent.md        # Next.js 版本规则 agent
└── app/
    ├── layout.tsx                 # 根布局，包裹所有页面，只渲染一次
    ├── page.tsx                   # 页面入口，对应 /
    ├── loading.tsx                # 路由加载时的 loading UI
    ├── error.tsx                  # 错误边界，捕获子组件错误
    ├── not-found.tsx              # 调用 notFound() 时显示
    ├── dashboard/
    │   ├── layout.tsx             # /dashboard 专属嵌套布局
    │   └── page.tsx               # /dashboard 页面
    ├── blog/
    │   └── [slug]/
    │       └── page.tsx           # /blog/:slug 动态路由，params.slug 获取参数
    └── api/
        └── users/
            └── route.ts           # /api/users Route Handler
```

## App Router 约定

- `page.tsx` 定义可访问页面。
- `layout.tsx` 定义共享布局，根布局必须包含 `html` 和 `body`。
- `loading.tsx`、`error.tsx`、`not-found.tsx` 是 UI 状态约定文件。
- 动态路由使用方括号目录，例如 `app/blog/[slug]/page.tsx`。
- Route Handler 使用 `route.ts`，且同一路由段不能同时存在 `page.tsx` 和 `route.ts`。
