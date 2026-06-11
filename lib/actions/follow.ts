/** @format */
'use server'

import { buildLoginRedirectUrl, getOptionalUserId } from '@/lib/auth'
import { prismaToggleFollow } from '@/lib/dal/follow'

export async function toggleFollowAction(
  targetId: string,
): Promise<{ following: boolean; redirectUrl?: string }> {
  const userId = await getOptionalUserId()
  if (!userId) {
    const redirectUrl = await buildLoginRedirectUrl()
    return { following: false, redirectUrl }
  }
  if (userId === targetId) return { following: false }
  return prismaToggleFollow(userId, targetId)
}
