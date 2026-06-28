/** @format */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

type ChatSessionPanelProps = {
  children: React.ReactNode
}

export default function ChatSessionPanel({ children }: ChatSessionPanelProps) {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type='button'
        aria-label='展开聊天记录'
        onClick={() => setOpen(true)}
        className='absolute right-4 top-4 z-20 hidden h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition hover:bg-hover hover:text-foreground lg:flex'>
        <ChevronLeftIcon
          className='h-5 w-5'
          strokeWidth={2.4}
        />
      </button>
    )
  }

  return (
    <aside className='hidden h-full w-72 shrink-0 border-l border-border bg-background px-4 py-5 lg:flex lg:flex-col'>
      <div className='mb-5 flex items-center gap-3 px-1'>
        <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-lg'>
          🐾
        </span>
        <div className='min-w-0 flex-1'>
          <h1 className='truncate text-xl font-semibold leading-tight'>YoYo</h1>
          <p className='truncate text-xs text-muted-foreground'>宠物 AI 助手</p>
        </div>
        <button
          type='button'
          aria-label='收起聊天记录'
          onClick={() => setOpen(false)}
          className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-hover hover:text-foreground'>
          <ChevronRightIcon
            className='h-4 w-4'
            strokeWidth={2.4}
          />
        </button>
      </div>

      <Link
        href='/yoyoai'
        className='mb-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-foreground px-3 text-sm font-medium text-background transition hover:opacity-85'>
        <PlusIcon
          className='h-4 w-4'
          strokeWidth={2.4}
        />
        新建聊天
      </Link>

      {children}
    </aside>
  )
}
