/** @format */
'use server'

import { z } from 'zod'
import {
  prismaGetPetCategories,
  prismaGetMyPets,
  prismaCreatePet,
  type PetCategory,
  type MyPet,
} from '@/app/_lib/dal/pet'

export async function fetchPetCategoriesAction(): Promise<PetCategory[]> {
  return prismaGetPetCategories()
}

export async function fetchMyPetsAction(): Promise<MyPet[]> {
  return prismaGetMyPets()
}

const createPetSchema = z.object({
  name: z.string().min(1, '请输入宠物名字').max(20, '名字最多 20 字'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '请选择出生日期'),
  categoryId: z.string().min(1, '请选择宠物类别'),
  avatar: z.string().optional(),
})

export type CreatePetState = { error?: string; pet?: MyPet } | null

function parseBirthDate(value: string): Date | null {
  const [year, month, day] = value.split('-').map(Number)
  const birthDate = new Date(Date.UTC(year, month - 1, day))

  if (
    birthDate.getUTCFullYear() !== year ||
    birthDate.getUTCMonth() !== month - 1 ||
    birthDate.getUTCDate() !== day
  ) {
    return null
  }

  return birthDate
}

function calculateAge(birthDate: Date, today = new Date()) {
  const birthYear = birthDate.getUTCFullYear()
  const birthMonth = birthDate.getUTCMonth()
  const birthDay = birthDate.getUTCDate()
  let age = today.getFullYear() - birthYear

  if (
    today.getMonth() < birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() < birthDay)
  ) {
    age -= 1
  }

  return age
}

export async function createPetAction(
  _prev: CreatePetState,
  formData: FormData,
): Promise<CreatePetState> {
  const parsed = createPetSchema.safeParse({
    name: formData.get('name'),
    birthDate: formData.get('birthDate'),
    categoryId: formData.get('categoryId'),
    avatar: formData.get('avatar') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? '输入有误' }
  }

  const birthDate = parseBirthDate(parsed.data.birthDate)
  if (!birthDate) return { error: '请选择有效的出生日期' }

  const age = calculateAge(birthDate)
  if (age < 0) return { error: '出生日期不能晚于今天' }
  if (age > 99) return { error: '年龄最多 99' }

  try {
    const pet = await prismaCreatePet({ ...parsed.data, birthDate, age })
    return { pet }
  } catch (e) {
    console.log('添加失败：', e)
    return { error: '添加失败，请重试' }
  }
}
