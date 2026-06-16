/** @format */

import { NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getOptionalUserId } from '@/lib/auth'
import { prismaCreateChatSessionWithMessage } from '@/lib/dal/chat'

const bodySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, '消息不能为空')
    .max(2000, '消息最多 2000 字'),
})

export async function POST(req: NextRequest) {
  const userId = await getOptionalUserId()
  if (!userId) {
    return Response.json({ error: '请先登录后再新建聊天' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: '请求体必须是合法的 JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? '参数有误' },
      { status: 400 },
    )
  }

  const { message } = parsed.data
  const data = await prismaCreateChatSessionWithMessage({
    userId,
    title: message.length > 30 ? `${message.slice(0, 30)}...` : message,
    content: message,
  })

  revalidatePath('/yoyoai', 'layout')

  return Response.json({ sessionId: data.session.id })
}
