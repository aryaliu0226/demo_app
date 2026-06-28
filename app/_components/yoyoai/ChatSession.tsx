/** @format */

import { fetchChatSessionsAction } from '@/app/_lib/actions/chat'
import ChatSessionList from '@/app/_components/yoyoai/ChatSessionList'

export default async function ChatSession() {
  const result = await fetchChatSessionsAction()
  const sessions = result.success ? result.sessions : []
  const error = result.success ? '' : result.error

  return (
    <div className='flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto'>
      {error && (
        <div className='px-1 py-2 text-xs text-muted-foreground'>{error}</div>
      )}

      {!error && <ChatSessionList sessions={sessions} />}
    </div>
  )
}
