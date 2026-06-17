/** @format */

import ChatSession from './_components/ChatSession'
import ChatSessionPanel from './_components/ChatSessionPanel'

export default function YoYoAILayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='relative flex h-full flex-1 overflow-hidden'>
      {children}
      <ChatSessionPanel>
        <ChatSession />
      </ChatSessionPanel>
    </main>
  )
}
