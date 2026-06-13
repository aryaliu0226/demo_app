/** @format */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useProfile } from '@/ui/profile/ProfilePrivider'
import PawPrintIcon from '@/ui/icon/PawPrintIcon'
import SparklesIcon from '@/ui/icon/SparklesIcon'

const navLinks = [
  { href: '/posts', label: '宠友圈', icon: PawPrintIcon },
  { href: '/yoyoai', label: '问问YoYo', icon: SparklesIcon },
]

export default function AsideNav() {
  const pathname = usePathname()
  const profile = useProfile()

  const displayName = profile
    ? (profile.nickname ?? profile.name ?? profile.account)
    : null

  return (
    <aside className='hidden md:flex h-full shrink-0 flex-col py-6 w-14 lg:w-[260px] px-2 lg:px-4 items-center lg:items-stretch hover'>
      {/* Logo */}
      <Link
        href='/posts'
        className='mb-8 flex items-center justify-center lg:justify-start gap-2 px-2'>
        <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background text-base'>
          🐾
        </span>
        <span className='hidden lg:block text-4xl font-bold tracking-tight'>
          CongYo
        </span>
      </Link>

      {/* 导航链接 */}
      <nav className='flex flex-1 flex-col gap-1 w-full'>
        {navLinks.map(link => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex h-12 lg:h-10 items-center justify-center lg:justify-start gap-3 rounded-lg px-3 font-medium transition-colors',
                isActive
                  ? 'bg-hover text-primary'
                  : 'text-muted-foreground hover:bg-hover hover:text-foreground',
              ].join(' ')}>
              <link.icon
                size={24}
                className='w-7 h-7 lg:w-6 lg:h-6 shrink-0'
              />
              <span className='hidden lg:block'>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* 底部用户信息 */}
      {profile && displayName && (
        <Link
          href='/profile'
          className='flex items-center justify-center lg:justify-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-hover'>
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={displayName}
              width={32}
              height={32}
              className='h-8 w-8 shrink-0 rounded-full object-cover'
            />
          ) : (
            <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hover text-sm font-semibold'>
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className='hidden lg:block min-w-0'>
            <p className='truncate text-sm font-medium'>{displayName}</p>
            <p className='truncate text-xs text-muted-foreground'>
              @{profile.account}
            </p>
          </div>
        </Link>
      )}
    </aside>
  )
}
