/** @format */

import prisma, { withPrismaException } from '@/app/_lib/prisma'

/** 查询 followerId 是否已关注 targetId */
export async function prismaGetIsFollowing(
  followerId: string,
  targetId: string,
): Promise<boolean> {
  const user = await withPrismaException(() =>
    prisma.user.findUnique({
      where: { id: followerId },
      select: {
        following: { where: { id: targetId }, select: { id: true } },
      },
    }),
  )
  return (user?.following.length ?? 0) > 0
}

/** 关注或取关，返回操作后的状态 */
export async function prismaToggleFollow(
  followerId: string,
  targetId: string,
): Promise<{ following: boolean }> {
  const isFollowing = await prismaGetIsFollowing(followerId, targetId)

  if (isFollowing) {
    await withPrismaException(() =>
      prisma.$transaction([
        prisma.user.update({
          where: { id: followerId },
          data: {
            following: { disconnect: { id: targetId } },
            followingCount: { decrement: 1 },
          },
        }),
        prisma.user.update({
          where: { id: targetId },
          data: { followerCount: { decrement: 1 } },
        }),
      ]),
    )
    return { following: false }
  } else {
    await withPrismaException(() =>
      prisma.$transaction([
        prisma.user.update({
          where: { id: followerId },
          data: {
            following: { connect: { id: targetId } },
            followingCount: { increment: 1 },
          },
        }),
        prisma.user.update({
          where: { id: targetId },
          data: { followerCount: { increment: 1 } },
        }),
      ]),
    )
    return { following: true }
  }
}
