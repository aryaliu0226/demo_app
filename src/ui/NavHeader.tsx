/** @format */

import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
export default function NavHeader({
  title,
  url,
}: {
  title: string
  url: string
}) {
  return (
    <header className=' inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/90 backdrop-blur'>
      <div className='mx-auto flex h-14 max-w-3xl items-center gap-3 px-6'>
        <Link
          href={url}
          className='flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900'>
          <ArrowUturnLeftIcon className='w-4 h-4' />
        </Link>
        <span className='text-zinc-300'>/</span>
        <span className='truncate text-sm text-zinc-500'>{title}</span>
      </div>
    </header>
  )
}
