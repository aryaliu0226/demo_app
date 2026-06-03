/** @format */

import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export type PetCategory = Prisma.PetCategoryGetPayload<Record<string, never>>

export const prismaGetPetCategories = async (): Promise<PetCategory[]> => {
  return prisma.petCategory.findMany({
    orderBy: { name: 'asc' },
  })
}
