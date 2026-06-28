/** @format */
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { verifyAuth } from '@/app/_lib/auth'
import {
  prismaUpdateUserProfile,
  prismaGetMyFavoritePosts,
  prismaGetMyPosts,
  prismaGetMyLikedPosts,
  type FavoritePost,
  type MyPost,
  type LikedPost,
} from '@/app/_lib/dal/profile'

const updateProfileSchema = z.object({
  nickname: z.string().max(20, '昵称最多 20 字').optional(),
  brief: z.string().max(200, '简介最多 200 字').optional(),
  avatar: z.string().optional(),
  gender: z.enum(['男', '女']).optional(),
  birthday: z.string().optional(), // ISO date string, e.g. "1990-01-01"
})

export type UpdateProfileState = { error?: string; success?: boolean } | null

export async function updateProfileAction(
  prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const userId = await verifyAuth()

  const parsed = updateProfileSchema.safeParse({
    nickname: formData.get('nickname') || undefined,
    brief: formData.get('brief') || undefined,
    avatar: formData.get('avatar') || undefined,
    gender: formData.get('gender') || undefined,
    birthday: formData.get('birthday') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '输入有误' }
  }

  const { birthday, ...rest } = parsed.data
  const updateData = {
    ...rest,
    ...(birthday ? { birthday: new Date(birthday) } : {}),
  }

  try {
    await prismaUpdateUserProfile(userId, updateData)
  } catch {
    return { error: '保存失败，请重试' }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function fetchMyPostsAction(): Promise<{
  data: MyPost[]
  total: number
}> {
  return prismaGetMyPosts({ pageNo: 1, pageSize: 100 })
}

export async function fetchMyLikedPostsAction(): Promise<LikedPost[]> {
  return prismaGetMyLikedPosts()
}

export async function fetchMyFavoritePostsAction(): Promise<FavoritePost[]> {
  return prismaGetMyFavoritePosts()
}
