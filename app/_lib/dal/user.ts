/** @format */

import prisma, { withPrismaException } from '@/app/_lib/prisma'
import { Prisma } from '@/generated/prisma/client'

export type LoginUser = Prisma.UserGetPayload<{
  select: { id: true; password: true }
}>

// 按账号查用户（登录用）
export async function prismaFindUserByAccount(
  account: string,
): Promise<LoginUser | null> {
  return withPrismaException(() =>
    prisma.user.findUnique({
      where: { account },
      select: { id: true, password: true },
    }),
  )
}
