/** @format */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import TopLogo from './TopLogo'

const tabs = [
  {
    href: '/posts',
    label: '宠友圈',
  },
  {
    href: '/user',
    label: '我的',
  },
]

export default function HeaderNav() {
  const pathname = usePathname()

  return (
    <header className='fixed inset-x-0 top-0 z-40 hidden w-full items-center justify-between px-6 py-2 shadow-sm backdrop-blur md:flex'>
      {/* 左侧 Logo */}
      <TopLogo />

      {/* 右侧导航 */}
      <nav
        aria-label='主导航'
        className='flex items-center gap-1'>
        {tabs.map(tab => {
          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`)

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex h-10 items-center rounded-md px-4 text-base font-medium transition-colors',
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
              ].join(' ')}>
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
