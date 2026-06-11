import { NextResponse, type NextRequest } from 'next/server'

// 不需要登录的公开路径（前缀匹配）
const PUBLIC_PATHS = ['/login', '/posts']

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 第一道门：cookie 存在性检查，不存在直接跳登录
  if (!isPublic(pathname) && !request.cookies.get('access_token')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 写入当前路径供 verifyAuth() 拼跳转 URL 用
  const response = NextResponse.next()
  response.headers.set('x-current-path', pathname)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
