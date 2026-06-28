/** @format */

import { notFound } from 'next/navigation'
import { verifyAuth } from '@/app/_lib/auth'
import { prismaGetChatSessionMessages } from '@/app/_lib/dal/chat'
import ChatMessage from '../_components/ChatMessage'

export default async function ChatMessagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [{ id }, userId] = await Promise.all([params, verifyAuth()])
  const messages = await prismaGetChatSessionMessages(userId, id)
  if (!messages) notFound()

  return (
    <section className='flex h-full w-full flex-1 flex-col justify-center'>
      <ChatMessage
        sessionId={id}
        initialMessages={messages}
      />
    </section>
  )
}
