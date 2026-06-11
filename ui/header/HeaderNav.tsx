/** @format */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Search from '../Search'

const titleMap: Record<string, string> = {
  '/posts': '宠友圈',
  '/profile': '个人中心',
  '/profile/posts': '我的帖子',
}

function getTitle(pathname: string): string {
  if (titleMap[pathname]) return titleMap[pathname]
  if (pathname.startsWith('/posts/')) return '帖子详情'
  if (pathname.startsWith('/profile/posts/')) return '帖子详情'
  return ''
}

export default function HeaderNav() {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <header className='sticky top-0 z-30 flex justify-content h-14 items-center bg-background   px-6'>
      <div className='flex-1'></div>
      {/* <span className='text-sm font-semibold'>{title}</span> */}
      <div className='flex flex-3 items-center justify-center gap-6'>
        <Search placeholder='搜索你感兴趣的～' />
      </div>
      <div className='flex flex-1 items-center justify-end gap-3'>
        <Link
          href='/posts/new'
          className='rounded-lg bg-hover px-3 py-1.5 text-xs font-medium transition hover:opacity-80'>
          + 发布
        </Link>
      </div>
    </header>
  )
}
