/** @format */
'use server'

import { revalidatePath } from 'next/cache'
import { getOptionalUserId } from '@/lib/auth'
import {
  prismaDeleteChatSession,
  prismaGetChatSessionsByUser,
  type ChatSessionListItem,
} from '@/lib/dal/chat'

export type FetchChatSessionsResult =
  | { success: true; sessions: ChatSessionListItem[] }
  | { success: false; error: string }

export type DeleteChatSessionResult =
  | { success: true }
  | { success: false; error: string }

export async function fetchChatSessionsAction(): Promise<FetchChatSessionsResult> {
  const userId = await getOptionalUserId()
  if (!userId) {
    return { success: false, error: '请先登录后再查看聊天记录' }
  }
  const sessions = await prismaGetChatSessionsByUser(userId)
  return { success: true, sessions }
}

export async function deleteChatSessionAction(
  sessionId: string,
): Promise<DeleteChatSessionResult> {
  const userId = await getOptionalUserId()
  if (!userId) {
    return { success: false, error: '请先登录后再删除聊天' }
  }

  const deleted = await prismaDeleteChatSession(userId, sessionId)
  if (!deleted) {
    return { success: false, error: '会话不存在或已被删除' }
  }

  revalidatePath('/yoyoai', 'layout')
  return { success: true }
}
