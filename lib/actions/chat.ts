/** @format */
'use server'

import { getOptionalUserId } from '@/lib/auth'
import {
  prismaCreateChatSession,
  prismaGetChatSessionsByUser,
  type ChatSessionListItem,
  type CreatedChatSession,
} from '@/lib/dal/chat'

export type CreateChatSessionResult =
  | { success: true; session: CreatedChatSession }
  | { success: false; error: string }

export type FetchChatSessionsResult =
  | { success: true; sessions: ChatSessionListItem[] }
  | { success: false; error: string }

export async function createChatSessionAction(): Promise<CreateChatSessionResult> {
  const userId = await getOptionalUserId()
  if (!userId) {
    return { success: false, error: '请先登录后再新建聊天' }
  }
  const session = await prismaCreateChatSession(userId)
  return { success: true, session }
}

export async function fetchChatSessionsAction(): Promise<FetchChatSessionsResult> {
  const userId = await getOptionalUserId()

  if (!userId) {
    return { success: false, error: '请先登录后再查看聊天记录' }
  }

  const sessions = await prismaGetChatSessionsByUser(userId)

  return { success: true, sessions }
}
