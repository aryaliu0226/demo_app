/** @format */

'use client'

import { useEffect, useRef, useState } from 'react'
import type { Route } from 'next'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { fetchSearchSuggestionsAction } from '@/app/_lib/actions/post'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const urlKeywords = searchParams.get('keywords') ?? ''
  const [value, setValue] = useState(urlKeywords)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setValue(urlKeywords)
  }, [urlKeywords])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = useDebouncedCallback(async (term: string) => {
    if (!term.trim()) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const results = await fetchSearchSuggestionsAction(term)
    setSuggestions(results)
    setOpen(results.length > 0)
  }, 200)

  const commitSearch = (term: string) => {
    setValue(term)
    setSuggestions([])
    setOpen(false)
    const params = new URLSearchParams(searchParams)
    term ? params.set('keywords', term) : params.delete('keywords')
    replace(`${pathname}?${params.toString()}` as Route)
  }

  return (
    <div
      ref={containerRef}
      className='relative w-full max-w-[460px]'>
      {/* 输入框 */}
      <div className='flex items-center overflow-hidden rounded bg-hover ring-2 ring-transparent transition-all focus-within:ring-primary'>
        <input
          className='min-w-0 flex-1 bg-transparent py-2 pl-4 text-sm outline-none placeholder:text-muted-foreground'
          placeholder={placeholder}
          value={value}
          onChange={e => {
            setValue(e.target.value)
            fetchSuggestions(e.target.value)
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') commitSearch(value)
            if (e.key === 'Escape') setOpen(false)
          }}
        />
        {value && (
          <button
            onMouseDown={e => {
              e.preventDefault()
              commitSearch('')
            }}
            className='px-1 text-muted-foreground hover:text-foreground'>
            <XMarkIcon className='h-4 w-4' />
          </button>
        )}
        <button
          onClick={() => commitSearch(value)}
          className='flex shrink-0 items-center gap-1.5 border-l border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
          <MagnifyingGlassIcon className='h-4 w-4' />
          搜索
        </button>
      </div>

      {/* 建议列表 */}
      {open && (
        <ul className='absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg'>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => commitSearch(s)}
              className='flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-card-foreground transition-colors hover:bg-hover'>
              <MagnifyingGlassIcon className='h-3.5 w-3.5 shrink-0 text-muted-foreground' />
              <span className='truncate'>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
