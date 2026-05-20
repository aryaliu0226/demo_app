/** @format */

import { Fetch } from '@/config/fetch.config'
import { Blog } from '@/lib/data'
import CardSkeleton from '@/ui/blog/card-skeleton'
import Search from '@/ui/blog/Search'
import TopLogo from '@/ui/TopLogo'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

function getCover(blog: Blog) {
  return blog.pictures[0]?.[0]
}

export default async function BlogPage() {
  const blogs = await Fetch<Blog[]>('/api/blog')
  const sortedBlogs = [...blogs].sort((prev, next) => {
    if (getCover(prev) && !getCover(next)) {
      return -1
    }

    if (!getCover(prev) && getCover(next)) {
      return 1
    }

    return 0
  })

  return (
    <main className='min-h-dvh bg-zinc-50 px-6 py-10 text-zinc-950 sm:py-14'>
      <TopLogo></TopLogo>
      <Suspense
        fallback={
          <section className='mx-auto mt-8 w-full max-w-6xl'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </section>
        }>
        <Search blogs={sortedBlogs} />
      </Suspense>
    </main>
  )
}
