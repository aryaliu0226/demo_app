/** @format */
'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'

// ─── JWT 密钥 ─────────────────────────────────────────────────────────────────
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('环境变量 JWT_SECRET 未配置')
  return new TextEncoder().encode(secret)
}

// ─── 写入认证 Cookie（供 login.ts 调用）──────────────────────────────────────
export async function setAuthCookie(userId: string) {
  const jwtSecret = getJwtSecret()

  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(jwtSecret)

  const cookieStore = await cookies()
  cookieStore.set('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
}

// ─── 退出登录：清除 Cookie ───────────────────────────────────────────────────
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete({ name: 'access_token', path: '/' })
}

// ─── 构造带 redirect 参数的登录 URL ──────────────────────────────────────────
// proxy.ts 会在每个请求的响应头里写入 x-current-path，这里直接读取。
export async function buildLoginRedirectUrl(): Promise<string> {
  const headersList = await headers()
  const pathname = headersList.get('x-current-path')
  // 已在登录页或无路径信息时，直接跳 /login
  if (!pathname || pathname === '/login') return '/login'
  return `/login?redirect=${encodeURIComponent(pathname)}`
}

// ─── 验证 Cookie 中的 JWT，返回 userId（不查 DB）────────────────────────────
// 校验失败时跳转至 /login?redirect=<当前路径>，登录成功后可自动回跳。
export async function verifyAuth(): Promise<string> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) redirect(await buildLoginRedirectUrl())

  try {
    const jwtSecret = getJwtSecret()
    const { payload } = await jwtVerify(token, jwtSecret)
    const userId = payload.sub
    if (!userId) redirect(await buildLoginRedirectUrl())
    return userId
  } catch {
    redirect(await buildLoginRedirectUrl())
  }
}
