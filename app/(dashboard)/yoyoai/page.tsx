/** @format */

import { verifyAuth } from '@/lib/auth'
import NewChatBox from '@/ui/yoyoai/NewChatBox'

export default async function YoYoAIPage() {
  await verifyAuth()
  return (
    <section className='flex h-full w-full flex-1 flex-col justify-center'>
      <div className='mx-auto flex flex-col items-center justify-center gap-3 text-muted-foreground'>
        <span className='text-5xl'>🐾</span>
        <p className='text-sm'>有什么关于宠物的问题，尽管问 YoYo～</p>
      </div>
      <NewChatBox />
    </section>
  )
}
