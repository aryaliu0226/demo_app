/** @format */

import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { fetchChatSessionsAction } from '@/lib/actions/chat'

function formatSessionTime(value: Date) {
  const now = new Date()
  const isToday = value.toDateString() === now.toDateString()

  if (isToday) {
    return value.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return value.toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  })
}

export default async function ChatSession() {
  const result = await fetchChatSessionsAction()
  const sessions = result.success ? result.sessions : []
  const error = result.success ? '' : result.error

  return (
      <div className='flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto'>
        {error && (
          <div className='px-1 py-2 text-xs text-muted-foreground'>{error}</div>
        )}

        {!error &&
          sessions.map((session, index) => (
            <div
              key={session.id}
              className={[
                'flex cursor-default gap-3 rounded-lg px-3 py-2.5 transition',
                index === 0 ? 'bg-secondary' : 'hover:bg-hover',
              ].join(' ')}>
              <ChatBubbleLeftRightIcon
                className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground'
                strokeWidth={2.2}
              />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <p className='truncate text-sm font-medium'>
                    {session.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
  )
}
