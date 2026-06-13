/** @format */

import { PlusIcon } from '@heroicons/react/24/outline'
import ChatSession from '@/ui/yoyoai/ChatSession'

export default function YoYoAILayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='flex h-full flex-1 overflow-hidden'>
      {children}

      <aside className='hidden h-full w-72 shrink-0 border-l border-border bg-background px-4 py-5 lg:flex lg:flex-col'>
        <div className='mb-5 flex items-center gap-3 px-1'>
          <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg'>
            🐾
          </span>
          <div className='min-w-0'>
            <h1 className='truncate text-xl font-semibold leading-tight'>
              YoYo
            </h1>
            <p className='truncate text-xs text-muted-foreground'>
              宠物 AI 助手
            </p>
          </div>
        </div>

        <button className='mb-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-foreground px-3 text-sm font-medium text-background transition hover:opacity-85'>
          <PlusIcon
            className='h-4 w-4'
            strokeWidth={2.4}
          />
          新建聊天
        </button>

        <ChatSession />
      </aside>
    </main>
  )
}
