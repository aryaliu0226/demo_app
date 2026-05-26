/** @format */
import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export type PostQuery = {
  pageNo: number
  pageSize: number
  keywords?: string
}

export type Post = Prisma.PostGetPayload<{
  include: {
    author: true
  }
}>

//查列表
export const getPostsApi = async (
  params: PostQuery,
): Promise<{ data: Post[]; total: number }> => {
  const { pageNo = 1, pageSize = 20, keywords = '' } = params
  const where = {
    title: {
      contains: keywords, // 根据标题关键词进行模糊搜索
    },
  }
  const skip = (pageNo - 1) * pageSize
  const take = pageSize
  const orderBy = {
    createdAt: Prisma.SortOrder.desc, // 按照创建时间降序排序
  }

  try {
    const [data, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        include: {
          author: true,
        },
        skip,
        take,
        orderBy,
      }),
      prisma.post.count({ where }),
    ])
    return { data, total }
  } catch (error) {
    console.error('Error fetching posts----------:', error)
    throw error
  }
}

// 帖子详情类型（含作者 + 评论 + 评论者）
export type PostDetail = Prisma.PostGetPayload<{
  include: {
    author: true
    commentList: {
      include: {
        author: true
      }
    }
  }
}>

// 根据 id 查帖子详情及评论
export const getPostByIdApi = async (
  id: string,
): Promise<PostDetail | null> => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        commentList: {
          include: {
            author: true, // 评论者信息
          },
          orderBy: {
            createdAt: Prisma.SortOrder.asc, // 评论按时间正序
          },
        },
      },
    })
    return post
  } catch (error) {
    console.error('Error fetching post by id:', error)
    throw error
  }
}
