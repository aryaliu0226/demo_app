/** @format */
'use server'

import { z } from 'zod'
import {
  prismaGetPetCategories,
  prismaGetMyPets,
  prismaCreatePet,
  type PetCategory,
  type MyPet,
} from '@/lib/dal/pet'

export async function fetchPetCategoriesAction(): Promise<PetCategory[]> {
  return prismaGetPetCategories()
}

export async function fetchMyPetsAction(): Promise<MyPet[]> {
  return prismaGetMyPets()
}

const createPetSchema = z.object({
  name: z.string().min(1, '请输入宠物名字').max(20, '名字最多 20 字'),
  age: z.coerce.number().int().min(0, '年龄不能为负').max(99, '年龄最多 99'),
  categoryId: z.string().min(1, '请选择宠物类别'),
  avatar: z.string().optional(),
})

export type CreatePetState = { error?: string; pet?: MyPet } | null

export async function createPetAction(
  _prev: CreatePetState,
  formData: FormData,
): Promise<CreatePetState> {
  const parsed = createPetSchema.safeParse({
    name: formData.get('name'),
    age: formData.get('age'),
    categoryId: formData.get('categoryId'),
    avatar: formData.get('avatar') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '输入有误' }
  }

  try {
    const pet = await prismaCreatePet(parsed.data)
    return { pet }
  } catch {
    return { error: '添加失败，请重试' }
  }
}
