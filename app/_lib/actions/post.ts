/** @format */
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { verifyAuth } from '@/app/_lib/auth'
import {
  prismaGetPosts,
  prismaGetSearchSuggestions,
  prismaCreatePost,
  prismaDeletePost,
  prismaTogglePostFavorite,
  prismaTogglePostLike,
  type Post,
  type PostQuery,
} from '@/app/_lib/dal/post'
import {
  type ActionResult,
  serverActionError,
  serverActionMessage,
} from '@/app/_lib/actions/result'

export { type PostQuery }

export async function fetchSearchSuggestionsAction(
  keywords: string,
): Promise<ActionResult<string[]>> {
  try {
    return { success: true, data: await prismaGetSearchSuggestions(keywords) }
  } catch (e) {
    return serverActionError(e)
  }
}

export async function fetchPostsAction(
  params: PostQuery,
): Promise<ActionResult<{ data: Post[]; total: number }>> {
  try {
    return { success: true, data: await prismaGetPosts(params) }
  } catch (e) {
    return serverActionError(e)
  }
}

const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最多 100 字'),
  bref: z.string().max(300, '简介最多 300 字').optional(),
  categoryId: z.string().optional(),
  published: z.boolean().optional(),
  pictures: z.array(z.string()).optional(),
  video: z.string().optional(),
})

export type CreatePostState = {
  errors?: Record<string, string[]>
  message?: string
}

export async function createPostAction(
  _prev: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const authorId = await verifyAuth()

  const raw = {
    title: formData.get('title') as string,
    bref: (formData.get('bref') as string) || undefined,
    categoryId: (formData.get('categoryId') as string) || undefined,
    published: formData.get('published') === 'true',
    pictures: formData.getAll('pictures').filter(Boolean) as string[],
    video: (formData.get('video') as string) || undefined,
  }

  const parsed = createPostSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors }
  }

  try {
    await prismaCreatePost(authorId, {
      title: parsed.data.title,
      content: parsed.data.bref,
      categoryId: parsed.data.categoryId,
      published: parsed.data.published,
      pictures: parsed.data.pictures,
      video: parsed.data.video,
    })
  } catch (e) {
    return { message: serverActionMessage(e) }
  }

  revalidatePath('/posts')
  redirect('/posts')
}

export async function deletePostAction(
  postId: string,
): Promise<{ error: string } | undefined> {
  const userId = await verifyAuth()
  try {
    await prismaDeletePost(postId, userId)
  } catch (e) {
    return { error: e instanceof Error ? e.message : serverActionMessage(e) }
  }
  revalidatePath('/posts')
  revalidatePath('/profile')
  redirect('/posts')
}

export async function togglePostLikeAction(
  postId: string,
): Promise<
  | { liked: boolean; likeCount: number; authorStars: number }
  | { error: string }
> {
  const userId = await verifyAuth()
  try {
    const result = await prismaTogglePostLike(postId, userId)
    revalidatePath(`/posts/${postId}`)
    revalidatePath('/profile')
    return result
  } catch (e) {
    return { error: e instanceof Error ? e.message : serverActionMessage(e) }
  }
}

export async function togglePostFavoriteAction(
  postId: string,
): Promise<{ favorited: boolean; stars: number } | { error: string }> {
  const userId = await verifyAuth()
  try {
    const result = await prismaTogglePostFavorite(postId, userId)
    revalidatePath(`/posts/${postId}`)
    revalidatePath('/profile')
    return result
  } catch (e) {
    return { error: e instanceof Error ? e.message : serverActionMessage(e) }
  }
}
