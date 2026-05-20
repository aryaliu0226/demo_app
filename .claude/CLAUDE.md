# Claude Project Guide

## 基本规则

- 先阅读并遵守 `.claude/agents/nextjs-agent.md`。
- 本项目使用 Next.js 16.2.6。这个版本里 Middleware 已更名为 Proxy；使用 `src` 目录后，请求拦截入口只保留 `src/proxy.ts`，不要新增 `middleware.ts` 或 `middleware.*` 配置文件。
- 修改 App Router 相关代码前，优先查阅 `node_modules/next/dist/docs/` 中对应文档，避免沿用旧版 Next.js 约定。

## 项目目录

```txt
.
├── next.config.ts                 # Next.js 总配置文件
├── .claude/
│   ├── CLAUDE.md                  # Claude 项目说明
│   └── agents/
│       └── nextjs-agent.md        # Next.js 版本规则 agent
└── src/
    ├── proxy.ts                   # 请求拦截 / 鉴权 / 重定向，Next 16 中替代 middleware.ts
    ├── styles/
    │   └── globals.css            # 全局样式入口，由根 layout 导入
    └── app/
        ├── layout.tsx             # 根布局，包裹所有页面，只渲染一次
        ├── page.tsx               # 页面入口，对应 /
        ├── favicon.ico            # favicon 约定文件，Next.js 要求放在 app 顶层
        ├── loading.tsx            # 路由加载时的 loading UI
        ├── error.tsx              # 错误边界，捕获子组件错误
        ├── not-found.tsx          # 调用 notFound() 时显示
        ├── dashboard/
        │   ├── layout.tsx         # /dashboard 专属嵌套布局
        │   └── page.tsx           # /dashboard 页面
        ├── blog/
        │   └── [slug]/
        │       └── page.tsx       # /blog/:slug 动态路由，params.slug 获取参数
        └── api/
            └── users/
                └── route.ts       # /api/users Route Handler
```

## App Router 约定

- `page.tsx` 定义可访问页面。
- `layout.tsx` 定义共享布局，根布局必须包含 `html` 和 `body`。
- `loading.tsx`、`error.tsx`、`not-found.tsx` 是 UI 状态约定文件。
- 动态路由使用方括号目录，例如 `app/blog/[slug]/page.tsx`。
- Route Handler 使用 `route.ts`，且同一路由段不能同时存在 `page.tsx` 和 `route.ts`。
- `src/app` 保持路由目录职责；通用样式、组件、工具函数等非路由代码放在 `src` 下的平级目录中，例如 `src/styles`。
- `favicon.ico` 是 metadata 约定文件，只能放在 `src/app/` 顶层；不要移动到 `styles/`、`assets/` 或其他子目录。
