/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export type PostQuery = {
  pageNo: number
  pageSize: number
  keywords?: string
  categoryId?: string
}

export type Post = Prisma.PostGetPayload<{
  include: { author: true }
}>

export type PostDetail = Prisma.PostGetPayload<{
  include: {
    author: true
    commentList: { include: { author: true } }
    likes: true
  }
}>

export const prismaGetPosts = async (
  params: PostQuery,
): Promise<{ data: Post[]; total: number }> => {
  const { pageNo = 1, pageSize = 20, keywords = '', categoryId } = params
  const where: Prisma.PostWhereInput = {
    title: { contains: keywords },
    ...(categoryId ? { categoryId } : {}),
  }
  const skip = (pageNo - 1) * pageSize

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      include: { author: true },
      skip,
      take: pageSize,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    }),
    prisma.post.count({ where }),
  ])

  return { data, total }
}

export const prismaGetSearchSuggestions = async (
  keywords: string,
  limit = 8,
): Promise<string[]> => {
  if (!keywords.trim()) return []
  const posts = await prisma.post.findMany({
    where: { title: { contains: keywords, mode: 'insensitive' } },
    select: { title: true },
    take: limit,
    orderBy: { createdAt: Prisma.SortOrder.desc },
  })
  return posts.map(p => p.title)
}

export const prismaGetPostById = async (id: string): Promise<PostDetail | null> => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      commentList: {
        include: { author: true },
        orderBy: { createdAt: Prisma.SortOrder.asc },
      },
      likes: true,
    },
  })
}
