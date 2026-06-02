/** @format */
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Post } from '@/lib/dal/post'
import { fetchPostsAction } from '@/lib/actions/post'
import PostCard from '@/ui/post/PostCard'
import CardSkeleton from '@/ui/post/CardSkeleton'

const PAGE_SIZE = 20

export default function PostList() {
  const searchParams = useSearchParams()
  const keywords = searchParams.get('keywords') ?? ''

  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [initialLoading, setInitialLoading] = useState(true)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isPending, startTransition] = useTransition()

  // 搜索词变化或首次挂载时，重置并拉取第一页
  useEffect(() => {
    pageRef.current = 0
    setPosts([])
    setTotal(0)
    setInitialLoading(true)
    loadingRef.current = true

    startTransition(async () => {
      const { data, total } = await fetchPostsAction({
        pageNo: 1,
        pageSize: PAGE_SIZE,
        keywords,
      })
      pageRef.current = 1
      setPosts(data)
      setTotal(total)
      setInitialLoading(false)
      loadingRef.current = false
    })
  }, [keywords])

  // 滚动到底加载下一页
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (loadingRef.current) return
        if (pageRef.current * PAGE_SIZE >= total) return

        loadingRef.current = true
        pageRef.current += 1

        startTransition(async () => {
          const { data, total: newTotal } = await fetchPostsAction({
            pageNo: pageRef.current,
            pageSize: PAGE_SIZE,
            keywords,
          })
          setPosts(prev => {
            const seen = new Set(prev.map(p => p.id))
            return [...prev, ...data.filter(p => !seen.has(p.id))]
          })
          setTotal(newTotal)
          loadingRef.current = false
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [keywords, total])

  if (initialLoading) {
    return (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className='flex items-center justify-center py-20 text-muted-foreground'>
        暂无内容
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={sentinelRef} className='h-2' />

      {isPending && (
        <div className='flex h-16 items-center justify-center text-sm text-muted-foreground'>
          加载中...
        </div>
      )}
    </>
  )
}
