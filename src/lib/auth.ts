/** @format */
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Prisma } from '@/generated/prisma/client'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

// ✅ 显式定义状态类型，和 useActionState 的初始值 null 对齐
type SignupState = { error: string } | null

export async function signup(
  prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  // 1. 取数据 + 校验（formData.get 返回的是 string | null，必须兜底）
  const account = (formData.get('account') as string)?.trim()
  const password = formData.get('password') as string

  if (!account || !password) return { error: '账号和密码不能为空' }
  if (password.length < 6) return { error: '密码至少 6 位' }

  // 2. 加密
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. 直接创建，靠数据库唯一约束兜底查重（避免并发竞态）
  let newUser
  try {
    newUser = await prisma.user.create({
      data: {
        account: account,
        nickname: account,
        password: hashedPassword,
        phone: `signup-${account}`,
        email: `${account}@congyo.local`,
      },
    })
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      return { error: '用户已存在！' }
    }
    throw e
  }

  // 4. 写 cookie
  const cookieStore = await cookies()
  cookieStore.set('access_token', String(newUser.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ⚠️ 开发环境是 http
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  // 5. 跳转（必须在 try/catch 之外，原因见下）
  redirect('/posts')
}
