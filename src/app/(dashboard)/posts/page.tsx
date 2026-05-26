/** @format */

import BlogList from '@/ui/post/PostList'
import Search from '@/ui/post/Search'
import ScrollPage from '@/ui/ScrollPage'
import { getPostsApi } from '@/lib/post'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function BlogPage(props: {
  searchParams?: Promise<{
    keywords?: string
    pageNo?: string
  }>
}) {
  const searchParams = await props.searchParams

  console.log('BlogPage received searchParams:', searchParams) // 调试日志
  const query = searchParams?.keywords || ''
  const currentPage = Number(searchParams?.pageNo) || 1

  const { data: posts, total } = await getPostsApi({
    keywords: query,
    pageNo: currentPage,
    pageSize: 20,
  })

  return (
    <main className='min-h-dvh bg-zinc-50 px-6 pb-10 pt-28 text-zinc-950 sm:pb-14'>
      <section className=' inset-x-0 top-0 z-50 border-b border-zinc-200/80 bg-zinc-50/90 px-6 py-4 backdrop-blur'>
        <div className='mx-auto w-full max-w-6xl'>
          <Search placeholder='' />
        </div>
      </section>
      <section className='mx-auto  w-full max-w-6xl'>
        <Suspense
          fallback={
            <div className='flex h-16 items-center justify-center'>
              加载中...
            </div>
          }>
          <ScrollPage total={total}>
            <BlogList posts={posts} />
          </ScrollPage>
        </Suspense>
      </section>
      <div className='flex h-16 items-center justify-center' />
    </main>
  )
}
