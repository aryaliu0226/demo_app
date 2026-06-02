/** @format */

'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    // params.set('pageNo', '1')
    if (term) {
      params.set('keywords', term)
    } else {
      params.delete('keywords')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)
  return (
    <div className='relative w-full max-w-[400px]'>
      <input
        className='peer block w-full rounded-md bg-hover py-[9px] pl-10 text-sm outline-none placeholder:text-muted-foreground'
        placeholder={placeholder}
        onChange={e => handleSearch(e.target.value)}
        defaultValue={searchParams.get('keywords')?.toString() || ''}
      />
      <MagnifyingGlassIcon className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-foreground' />
    </div>
  )
}
