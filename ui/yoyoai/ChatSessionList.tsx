/** @format */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TrashIcon } from '@heroicons/react/24/outline'
// import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { deleteChatSessionAction } from '@/lib/actions/chat'
import type { ChatSessionListItem } from '@/lib/dal/chat'

type ChatSessionListProps = {
  sessions: ChatSessionListItem[]
}

export default function ChatSessionList({ sessions }: ChatSessionListProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function deleteSession(
    e: React.MouseEvent<HTMLButtonElement>,
    sessionId: string,
  ) {
    e.preventDefault()
    e.stopPropagation()

    if (deletingId) return

    setError('')
    setDeletingId(sessionId)

    try {
      const result = await deleteChatSessionAction(sessionId)

      if (!result.success) {
        setError(result.error)
        return
      }

      if (pathname === `/yoyoai/${sessionId}`) {
        router.push('/yoyoai')
      }

      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      {error && <p className='px-3 py-2 text-xs text-destructive'>{error}</p>}
      {sessions.map(session => {
        const href = `/yoyoai/${session.id}`
        const isActive = pathname === href

        return (
          <Link
            key={session.id}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'group flex gap-3 rounded-lg px-3 py-2.5 transition',
              isActive ? 'bg-secondary' : 'hover:bg-hover',
            ].join(' ')}>
            {/* <ChatBubbleLeftRightIcon
              className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground'
              strokeWidth={2.2}
            /> */}
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium'>{session.title}</p>
            </div>
            <button
              type='button'
              aria-label='删除会话'
              onClick={e => deleteSession(e, session.id)}
              disabled={deletingId === session.id}
              className='flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground opacity-0 transition hover:bg-hover hover:text-destructive disabled:opacity-40 group-hover:opacity-100'>
              <TrashIcon
                className='h-4 w-4'
                strokeWidth={2.2}
              />
            </button>
          </Link>
        )
      })}
    </>
  )
}
