/** @format */
'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { setAuthCookie } from '@/lib/auth'

const loginSchema = z.object({
  account: z.string().min(1, '账号不能为空').max(32, '账号最多 32 位').trim(),
  password: z.string().min(6, '密码至少 6 位').max(64, '密码最多 64 位'),
})

export type LoginState = {
  error?: { account?: string; password?: string }
} | null

export async function loginApi(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    account: formData.get('account'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const error: NonNullable<LoginState>['error'] = {}
    parsed.error.issues.forEach(issue => {
      const field = issue.path[0]
      if (field === 'account' || field === 'password') {
        error[field] ??= issue.message
      }
    })
    return { error }
  }

  const { account, password } = parsed.data

  const existingUser = await prisma.user.findUnique({
    where: { account },
    select: { id: true, password: true },
  })

  const referer = (await headers()).get('referer') ?? ''
  const redirectTo = referer
    ? (new URL(referer).searchParams.get('redirect') ?? '/posts')
    : '/posts'

  if (existingUser) {
    const isValid = await bcrypt.compare(password, existingUser.password)
    if (!isValid) return { error: { password: '密码错误' } }
    await setAuthCookie(existingUser.id)
    redirect(redirectTo)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.user.create({
    data: {
      account,
      nickname: account,
      password: hashedPassword,
      phone: `login-${account}`,
      email: `${account}@congyo.local`,
    },
    select: { id: true },
  })
  await setAuthCookie(newUser.id)
  redirect(redirectTo)
}
