/** @format */
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { verifyAuth } from '@/lib/auth'
import { prismaUpdateUserProfile } from '@/lib/dal/profile'

const updateProfileSchema = z.object({
  nickname: z.string().max(32, '昵称最多 32 位').optional(),
  name: z.string().max(32, '姓名最多 32 位').optional(),
  email: z.string().email('邮箱格式不正确').optional().or(z.literal('')),
  phone: z.string().max(20, '手机号最多 20 位').optional(),
  brief: z.string().max(200, '简介最多 200 字').optional(),
})

export type UpdateProfileState = { error?: string; success?: boolean } | null

export async function updateProfileAction(
  prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const userId = await verifyAuth()

  const parsed = updateProfileSchema.safeParse({
    nickname: formData.get('nickname') || undefined,
    name: formData.get('name') || undefined,
    email: formData.get('email') || undefined,
    phone: formData.get('phone') || undefined,
    brief: formData.get('brief') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '输入有误' }
  }

  try {
    await prismaUpdateUserProfile(userId, parsed.data)
  } catch {
    return { error: '保存失败，请重试' }
  }

  revalidatePath('/profile')
  return { success: true }
}
