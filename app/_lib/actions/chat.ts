/** @format */
'use server'

import { revalidatePath } from 'next/cache'
import { getOptionalUserId } from '@/app/_lib/auth'
import {
  prismaDeleteChatSession,
  prismaGetChatSessionsByUser,
  type ChatSessionListItem,
} from '@/app/_lib/dal/chat'
import { serverActionMessage } from '@/app/_lib/actions/result'

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
  try {
    const sessions = await prismaGetChatSessionsByUser(userId)
    return { success: true, sessions }
  } catch (e) {
    return { success: false, error: serverActionMessage(e) }
  }
}

// 删除会话
export async function deleteChatSessionAction(
  sessionId: string,
): Promise<DeleteChatSessionResult> {
  const userId = await getOptionalUserId()
  if (!userId) {
    return { success: false, error: '请先登录后再删除聊天' }
  }

  let deleted: boolean
  try {
    deleted = await prismaDeleteChatSession(userId, sessionId)
  } catch (e) {
    return { success: false, error: serverActionMessage(e) }
  }

  if (!deleted) {
    return { success: false, error: '会话不存在或已被删除' }
  }

  revalidatePath('/yoyoai', 'layout')
  return { success: true }
}
