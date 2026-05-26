# Claude Project Guide

## Read First

- Before editing this project, read `.claude/agents/nextjs-agent.md`.
- This is a Next.js 16.2.6 App Router project. Do not assume older Next.js middleware or routing behavior.
- Next.js 16 uses `proxy.ts` instead of `middleware.ts`. This project keeps the request interception entry at `src/proxy.ts`; do not add `middleware.ts`.
- Prefer checking local package docs or generated types before changing framework-sensitive code.

## Project Snapshot

- Framework: Next.js 16.2.6, React 19.2.4, TypeScript strict mode.
- Styling: Tailwind CSS v4 with shadcn/radix-nova tokens in `src/styles/globals.css`.
- UI libraries: shadcn components under `src/components/ui`, Heroicons, Lucide, Embla carousel.
- Database: PostgreSQL through Prisma 7 and `@prisma/adapter-pg`.
- Prisma client output: `src/generated/prisma`. Treat this as generated code.
- Primary app domain: a pet/community post feed with users, posts, comments, pets, and pet categories.

## Common Commands

```bash
npm run dev
npm run build
npm run lint
npx tsc --noEmit
npx tsx prisma/seed.ts
```

Notes:
- `npm run build` is the main production verification.
- Use `npx tsc --noEmit` for a fast type check.
- Seed data is configured in `prisma.config.ts`, but running `npx tsx prisma/seed.ts` directly is the practical path for this repo.
- Do not run database seed commands unless the user explicitly asks; they mutate the configured database.

## Directory Map

```txt
src/
  app/
    layout.tsx              Root layout and global ThemeProvider wrapper
    page.tsx                Home entry with links into the community
    posts/page.tsx          Server-rendered post list, search, pagination
    posts/[id]/page.tsx     Server-rendered post detail and comment list
    posts/new/page.tsx      Server action demo for creating a post
    signin/page.tsx         Placeholder sign-in/register page
    user/page.tsx           Placeholder user page
    user/[id]/page.tsx      Placeholder user detail page
    loading.tsx             App loading UI
    error.tsx               App error UI
    not-found.tsx           App 404 UI
  components/ui/            shadcn-generated UI primitives
  config/fetch.config.ts    Small fetch helper
  lib/
    prisma.ts               Prisma singleton using PrismaPg adapter
    post.ts                 Post query helpers and Prisma payload types
    utils.ts                cn() helper
  styles/globals.css        Tailwind v4, shadcn tokens, global CSS
  ui/
    ScrollPage.tsx          Client infinite-scroll URL pagination
    ThemePrivider.tsx       Theme context wrapper
    post/                   Post feed/detail UI components
  proxy.ts                  Next 16 Proxy entry

prisma/
  schema.prisma             Source of truth for database models
  seed.ts                   Mock seed data and upsert logic
  migrations/               Existing migration history
```

## App Router Rules

- `page.tsx` files define routes. Dynamic params in this project are typed as promises, for example `params: Promise<{ id: string }>`.
- `searchParams` in `src/app/posts/page.tsx` is also treated as a promise and awaited.
- Keep data fetching in server components or `src/lib/*` server helpers unless a client interaction truly needs browser APIs.
- Add `'use client'` only to components that use hooks, browser APIs, or client router APIs.
- `src/app/posts/page.tsx` is marked `dynamic = 'force-dynamic'` because list data depends on query params and database reads.

## Post Feed Behavior

- `/posts` reads `keywords` and `pageNo` from URL search params.
- `Search` updates the URL with `router.replace`; that triggers App Router navigation and causes the server page to receive new `searchParams`.
- `ScrollPage` updates `pageNo` in the URL when the user scrolls near the bottom.
- `getPostsApi()` queries `Post` records ordered by `createdAt desc`, includes `author`, and returns `{ data, total }`.
- If search behavior changes, keep URL query state as the source of truth.
- When changing search keywords, consider resetting `pageNo` to `1` to avoid requesting a stale page.

## Prisma Rules

- `prisma/schema.prisma` is the source of truth. Update seed data and query includes whenever model names or relations change.
- Prisma client is generated to `src/generated/prisma`; import types from `@/generated/prisma/client`.
- Runtime Prisma access should go through `src/lib/prisma.ts` unless there is a specific reason not to.
- The schema currently uses:
  - `Post.comments`: numeric denormalized comment count.
  - `Post.commentList`: relation to actual `Comment[]`.
- Do not use `Post.comments` as an array. Use `commentList` when rendering or querying real comments.
- Maintain `Post.comments` with `increment` and `decrement` when adding or deleting comments.
- Seed data writes explicit `comments` counts and creates matching `Comment` rows; avoid extra `comment.count()` sync queries unless the user asks for a repair script.
- `Comment` requires both `post` and `author` relations.
- `Pet` requires a `PetCategory`; `user` is optional in schema but current seed connects every pet to a user.

## Seed Data

- `prisma/seed.ts` uses upsert/find-or-create style logic and is intended to be rerunnable.
- `postData` is the curated post set; `generatedPostData` expands the feed.
- `commentData` uses `commentList` to mirror the Prisma relation name.
- When adding seeded comments, update the corresponding seeded post's `comments` count directly.
- Keep seed emails, category labels, and post titles consistent because they are used for `connect` or lookup operations.

## UI And Styling

- Keep route-specific UI under `src/app/*`; reusable app UI lives under `src/ui`; shadcn primitives live under `src/components/ui`.
- Use Tailwind classes and existing visual language: zinc/neutral surfaces, compact cards, restrained borders, small radii.
- Prefer `next/image` for remote images when dimensions are known. `next.config.ts` allows `images.unsplash.com`.
- Existing post cards currently use the first `pictures` URL as a cover.
- Use `cn()` from `src/lib/utils.ts` for conditional class merging in shared components.
- The file is named `ThemePrivider.tsx` in the repo. Preserve the existing import path unless intentionally renaming all references.

## Data Fetching And Mutations

- `src/lib/post.ts` owns post list/detail query helpers and Prisma payload types.
- Use Prisma transactions for paired list/count reads, as `getPostsApi()` does.
- For server actions, follow the pattern in `src/app/posts/new/page.tsx`: mutate, `revalidatePath`, then `redirect`.
- For comment create/delete features, update both `Comment` rows and `Post.comments` in the same transaction.

## Verification

- After TypeScript or Prisma shape changes, run:

```bash
npx tsc --noEmit
```

- After broader app changes, also run:

```bash
npm run build
```

- For frontend behavior changes, run the dev server and verify `/posts` and `/posts/[id]` in the browser.

## Things To Avoid

- Do not edit `src/generated/prisma` by hand.
- Do not add old-style `middleware.ts`.
- Do not move `src/app/favicon.ico`.
- Do not treat query state in `/posts` as local-only state; the URL drives server data.
- Do not seed or migrate the database without explicit user approval.
- Do not silently replace the shadcn component structure with unrelated UI patterns.
