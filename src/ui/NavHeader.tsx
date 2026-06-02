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
    <header className='inset-x-0 top-0 z-50  border-zinc-200/80  '>
      <div className='mx-auto flex h-14 max-w-3xl items-center gap-3 px-6'>
        <Link
          href={url}
          className='flex items-center gap-1.5 text-sm transition-colors hover:text-zinc-900'>
          <ArrowUturnLeftIcon className='w-5 h-5 ' />
        </Link>
        <span className='truncate'>{title}</span>
      </div>
    </header>
  )
}
