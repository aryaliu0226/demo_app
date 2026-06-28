/** @format */
'use client'

import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function HeaderLink({ title }: { title: string }) {
  const router = useRouter()

  return (
    <header className='absolute top-0 z-50 text-primary'>
      <div className='mx-auto flex h-14 max-w-3xl items-center gap-3 px-6'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-1.5 text-base transition-colors hover:text-primary/80'>
          <ArrowUturnLeftIcon className='h-5 w-5' />
        </button>
        <span className='truncate font-medium'>{title}</span>
      </div>
    </header>
  )
}
