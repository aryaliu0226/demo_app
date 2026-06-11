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
    favorites: true
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

export type CreatePostInput = {
  title: string
  content?: string
  categoryId?: string
  published?: boolean
  pictures?: string[]
  video?: string
}

export const prismaGetCategories = async () => {
  return prisma.petCategory.findMany({
    orderBy: { label: 'asc' },
  })
}

export const prismaCreatePost = async (
  authorId: string,
  input: CreatePostInput,
) => {
  return prisma.post.create({
    data: {
      title: input.title,
      content: input.content ?? '',
      published: input.published ?? false,
      authorId,
      pictures: input.pictures ?? [],
      video: input.video,
      categoryId: input.categoryId ?? null,
    },
  })
}

// 删除帖子，同步清理关联数据和冗余计数
// 事务顺序：删 Like/Favorite → 扣 User.stars → 删 Comment → 删 Post
export const prismaDeletePost = async (
  postId: string,
  authorId: string,
): Promise<void> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, likeCount: true },
  })
  if (!post) throw new Error('帖子不存在')
  if (post.authorId !== authorId) throw new Error('无权删除此帖子')

  await prisma.$transaction([
    // 删除所有点赞记录
    prisma.like.deleteMany({ where: { postId } }),
    // 删除所有收藏记录
    prisma.favorite.deleteMany({ where: { postId } }),
    // 扣减作者总获赞数（likeCount 即该帖子贡献的赞数）
    prisma.user.update({
      where: { id: authorId },
      data: { stars: { decrement: post.likeCount } },
    }),
    // 删除所有评论
    prisma.comment.deleteMany({ where: { postId } }),
    // 删除帖子本体
    prisma.post.delete({ where: { id: postId } }),
  ])
}

export type TogglePostFavoriteResult = {
  favorited: boolean
  stars: number
}

// 切换收藏状态，同步维护帖子收藏数
export const prismaTogglePostFavorite = async (
  postId: string,
  userId: string,
): Promise<TogglePostFavoriteResult> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  })
  if (!post) throw new Error('帖子不存在')

  return prisma.$transaction(async tx => {
    const existingFavorite = await tx.favorite.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { id: true },
    })

    if (existingFavorite) {
      await tx.favorite.delete({ where: { id: existingFavorite.id } })
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: { stars: { decrement: 1 } },
        select: { stars: true },
      })

      return { favorited: false, stars: updatedPost.stars }
    }

    await tx.favorite.create({ data: { userId, postId } })
    const updatedPost = await tx.post.update({
      where: { id: postId },
      data: { stars: { increment: 1 } },
      select: { stars: true },
    })

    return { favorited: true, stars: updatedPost.stars }
  })
}

export type TogglePostLikeResult = {
  liked: boolean
  likeCount: number
  authorStars: number
}

// 切换点赞状态，同步维护帖子点赞数和作者获赞数
export const prismaTogglePostLike = async (
  postId: string,
  userId: string,
): Promise<TogglePostLikeResult> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true },
  })
  if (!post) throw new Error('帖子不存在')

  return prisma.$transaction(async tx => {
    const existingLike = await tx.like.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { id: true },
    })

    if (existingLike) {
      await tx.like.delete({ where: { id: existingLike.id } })
      const [updatedPost, updatedAuthor] = await Promise.all([
        tx.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true },
        }),
        tx.user.update({
          where: { id: post.authorId },
          data: { stars: { decrement: 1 } },
          select: { stars: true },
        }),
      ])

      return {
        liked: false,
        likeCount: updatedPost.likeCount,
        authorStars: updatedAuthor.stars,
      }
    }

    await tx.like.create({ data: { userId, postId } })
    const [updatedPost, updatedAuthor] = await Promise.all([
      tx.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
        select: { likeCount: true },
      }),
      tx.user.update({
        where: { id: post.authorId },
        data: { stars: { increment: 1 } },
        select: { stars: true },
      }),
    ])

    return {
      liked: true,
      likeCount: updatedPost.likeCount,
      authorStars: updatedAuthor.stars,
    }
  })
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
      favorites: true,
    },
  })
}
