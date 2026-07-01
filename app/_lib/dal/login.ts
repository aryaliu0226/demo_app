/** @format */

import prisma, { withPrismaException } from '../prisma'

// 创建新用户（注册用）
export async function prismaCreateUser(data: {
  account: string
  nickname: string
  password: string
  phone: string
  email: string
}) {
  return withPrismaException(() =>
    prisma.user.create({
      data,
      select: { id: true },
    }),
  )
}
