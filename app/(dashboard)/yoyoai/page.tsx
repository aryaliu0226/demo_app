/** @format */

import { verifyAuth } from '@/lib/auth'
import YoYoChat from '@/ui/yoyoai/YoYoChat'

export default async function YoYoAIPage() {
  await verifyAuth()
  return (
    <>
      <YoYoChat />
    </>
  )
}
