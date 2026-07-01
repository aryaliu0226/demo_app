/** @format */
'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Route } from 'next'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { setAuthCookie } from '@/app/_lib/auth'
import { prismaFindUserByAccount } from '@/app/_lib/dal/user'
import { prismaCreateUser } from '@/app/_lib/dal/login'
import { serverActionMessage } from '@/app/_lib/actions/result'

const loginSchema = z.object({
  account: z.string().min(1, '账号不能为空').max(32, '账号最多 32 位').trim(),
  password: z.string().min(6, '密码至少 6 位').max(64, '密码最多 64 位'),
})

export type LoginState = {
  error?: { account?: string; password?: string }
  globalError?: string
  globalErrorId?: number
} | null

export async function fetchLoginAction(
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

  const referer = (await headers()).get('referer') ?? ''
  const redirectTo = (
    referer
      ? (new URL(referer).searchParams.get('redirect') ?? '/posts')
      : '/posts'
  ) as Route

  let userId: string

  try {
    const existingUser = await prismaFindUserByAccount(account)
    if (existingUser) {
      const isValid = await bcrypt.compare(password, existingUser.password)
      if (!isValid) return { error: { password: '密码错误' } }
      userId = existingUser.id
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await prismaCreateUser({
        account,
        nickname: account,
        password: hashedPassword,
        phone: '',
        email: '',
      })
      userId = newUser.id
    }
  } catch (e) {
    return {
      globalError: serverActionMessage(e),
      globalErrorId: Date.now(),
    }
  }

  await setAuthCookie(userId)
  redirect(redirectTo)
}
