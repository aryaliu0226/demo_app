/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/app/_lib/prisma'
import { verifyAuth } from '@/app/_lib/auth'

export type PetCategory = Prisma.PetCategoryGetPayload<Record<string, never>>

export type MyPet = Prisma.PetGetPayload<{
  include: { category: true }
}>

export const prismaGetPetCategories = async (): Promise<PetCategory[]> => {
  return prisma.petCategory.findMany({
    orderBy: { name: 'asc' },
  })
}

export const prismaGetMyPets = async (): Promise<MyPet[]> => {
  const userId = await verifyAuth()
  return prisma.pet.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { name: 'asc' },
  })
}

export const prismaCreatePet = async (data: {
  name: string
  age: number
  birthDate: Date
  categoryId: string
  avatar?: string
}) => {
  const userId = await verifyAuth()
  return prisma.pet.create({
    data: { ...data, userId },
    include: { category: true },
  }) as Promise<MyPet>
}
