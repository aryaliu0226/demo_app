/** @format */

'use client'

import { Fetch } from '@/config/fetch.config'
import { Blog } from '@/lib/data'
import BlogCard from '@/ui/blog/blog-card'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { useEffect, useRef, useState } from 'react'

export default function Search({ blogs }: { blogs: Blog[] }) {
  const [keyword, setKeyword] = useState('')
  const [filteredBlogs, setFilteredBlogs] = useState(blogs)
  const [isSearching, setIsSearching] = useState(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    const value = keyword.trim()

    async function searchBlogs() {
      setIsSearching(true)

      try {
        const data = await Fetch<Blog[]>('/api/blog', {
          keyword: value || undefined,
        })

        if (requestIdRef.current === requestId) {
          setFilteredBlogs(data)
        }
      } catch (error) {
        if (requestIdRef.current === requestId) {
          setFilteredBlogs([])
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setIsSearching(false)
        }
      }
    }

    const timer = window.setTimeout(searchBlogs, 250)

    return () => {
      window.clearTimeout(timer)
    }
  }, [keyword])

  return (
    <section className='mx-auto mt-8 w-full max-w-6xl'>
      <div className='mb-5 flex justify-end'>
        <div className='relative w-full sm:max-w-sm'>
          <MagnifyingGlassIcon className='pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400' />
          <input
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder='搜索标题、作者或内容'
            className='h-11 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-10 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-200'
          />
          {isSearching ? (
            <span className='absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600' />
          ) : null}
          {keyword ? (
            <button
              type='button'
              onClick={() => setKeyword('')}
              aria-label='清空搜索'
              className='absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700'>
              <XMarkIcon className='h-5 w-5' />
            </button>
          ) : null}
        </div>
      </div>

      {filteredBlogs.length ? (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredBlogs.map(blog => (
            <BlogCard
              blog={blog}
              key={blog.id}
            />
          ))}
        </div>
      ) : (
        <div className='flex min-h-64 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white px-6 text-center'>
          <div>
            <p className='text-base font-medium text-zinc-950'>没有找到结果</p>
            <p className='mt-2 text-sm text-zinc-500'>
              换个关键词试试，比如“养猫”、“散步”或作者名。
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
