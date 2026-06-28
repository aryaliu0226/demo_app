/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/app/_lib/prisma'
import { verifyAuth, buildLoginRedirectUrl } from '@/app/_lib/auth'
import { redirect } from 'next/navigation'
import type { PostQuery } from '@/app/_lib/dal/post'

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
    gender: true
    birthday: true
    stars: true
    followerCount: true
    followingCount: true
  }
}>

export type MyPost = Prisma.PostGetPayload<{
  include: { commentList: true; likes: true; favorites: true; author: true }
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
      gender: true,
      birthday: true,
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
    avatar?: string
    gender?: string
    birthday?: Date | null
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
      include: { commentList: true, likes: true, favorites: true, author: true },
      skip,
      take: pageSize,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    }),
    prisma.post.count({ where }),
  ])

  return { data, total }
}

// 当前登录用户点赞的帖子列表
export type LikedPost = Prisma.LikeGetPayload<{
  include: { post: { include: { author: true } } }
}>

export async function prismaGetMyLikedPosts(): Promise<LikedPost[]> {
  const userId = await verifyAuth()
  return prisma.like.findMany({
    where: { userId },
    include: { post: { include: { author: true } } },
    orderBy: { createdAt: Prisma.SortOrder.desc },
  })
}

// 当前登录用户收藏的帖子列表
export type FavoritePost = Prisma.FavoriteGetPayload<{
  include: { post: { include: { author: true } } }
}>

export async function prismaGetMyFavoritePosts(): Promise<FavoritePost[]> {
  const userId = await verifyAuth()
  return prisma.favorite.findMany({
    where: { userId },
    include: { post: { include: { author: true } } },
    orderBy: { createdAt: Prisma.SortOrder.desc },
  })
}
