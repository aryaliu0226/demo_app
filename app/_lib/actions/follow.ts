/** @format */
'use server'

import { buildLoginRedirectUrl, getOptionalUserId } from '@/app/_lib/auth'
import { prismaToggleFollow } from '@/app/_lib/dal/follow'
import { serverActionMessage } from '@/app/_lib/actions/result'

export async function toggleFollowAction(
  targetId: string,
): Promise<{ following: boolean; redirectUrl?: string; error?: string }> {
  const userId = await getOptionalUserId()
  if (!userId) {
    const redirectUrl = await buildLoginRedirectUrl()
    return { following: false, redirectUrl }
  }
  if (userId === targetId) return { following: false }
  try {
    return await prismaToggleFollow(userId, targetId)
  } catch (e) {
    return { following: false, error: serverActionMessage(e) }
  }
}
