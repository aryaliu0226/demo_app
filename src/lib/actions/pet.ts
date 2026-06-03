/** @format */
'use server'

import { prismaGetPetCategories, type PetCategory } from '@/lib/dal/pet'

export async function fetchPetCategoriesAction(): Promise<PetCategory[]> {
  return prismaGetPetCategories()
}
