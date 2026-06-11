/** @format */

import prisma from '@/lib/prisma'

// 按账号查用户（登录用）
export async function prismaFindUserByAccount(account: string) {
  return prisma.user.findUnique({
    where: { account },
    select: { id: true, password: true },
  })
}
