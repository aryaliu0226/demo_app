/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export type PostQuery = {
  pageNo: number
  pageSize: number
  keywords?: string
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

export const getPostsApi = async (
  params: PostQuery,
): Promise<{ data: Post[]; total: number }> => {
  const { pageNo = 1, pageSize = 20, keywords = '' } = params
  const where = { title: { contains: keywords } }
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

export const getPostByIdApi = async (id: string): Promise<PostDetail | null> => {
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
