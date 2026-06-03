/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { verifyAuth, buildLoginRedirectUrl } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { PostQuery } from '@/lib/dal/post'

export type Profile = Prisma.UserGetPayload<{
  select: {
    id: true
    account: true
    nickname: true
    name: true
    email: true
    phone: true
    avatar: true
    brief: true
    stars: true
    followerCount: true
    followingCount: true
  }
}>

export type MyPost = Prisma.PostGetPayload<{
  include: { commentList: true; likes: true; author: true }
}>

// 验 JWT + 查 DB，返回用户资料；DB 中不存在时跳回登录页
export async function prismaGetLoginUser(): Promise<Profile> {
  const userId = await verifyAuth()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      account: true,
      nickname: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      brief: true,
      stars: true,
      followerCount: true,
      followingCount: true,
    },
  })
  if (!user) redirect(await buildLoginRedirectUrl())
  return user
}

// 更新用户资料
export async function prismaUpdateUserProfile(
  userId: string,
  data: {
    nickname?: string
    name?: string
    email?: string
    phone?: string
    brief?: string
  },
) {
  return prisma.user.update({ where: { id: userId }, data })
}

// 查询当前登录用户的帖子列表
export async function prismaGetMyPosts(
  params: PostQuery,
): Promise<{ data: MyPost[]; total: number }> {
  const userId = await verifyAuth()
  const { pageNo = 1, pageSize = 20, keywords = '' } = params
  const where: Prisma.PostWhereInput = {
    authorId: userId,
    ...(keywords && { title: { contains: keywords } }),
  }
  const skip = (pageNo - 1) * pageSize

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      include: { commentList: true, likes: true, author: true },
      skip,
      take: pageSize,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    }),
    prisma.post.count({ where }),
  ])

  return { data, total }
}
