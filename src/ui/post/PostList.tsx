/** @format */
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { fetchPostsAction } from '@/lib/actions/post'
import type { Post } from '@/lib/dal/post'
import PostCard from '@/ui/post/PostCard'
import CardSkeleton from '@/ui/post/CardSkeleton'

const PAGE_SIZE = 40
const GRID =
  'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

export default function PostList() {
  const searchParams = useSearchParams()
  const keywords = searchParams.get('keywords') ?? ''
  const categoryId = searchParams.get('categoryId') ?? undefined

  const [posts, setPosts] = useState<Post[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const pageRef = useRef(0)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // 筛选条件变化时重置
  useEffect(() => {
    pageRef.current = 0
    setPosts([])
    setHasMore(true)
  }, [keywords, categoryId])

  // 加载下一页
  const loadMore = async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const nextPage = pageRef.current + 1
    const { data, total } = await fetchPostsAction({
      pageNo: nextPage,
      pageSize: PAGE_SIZE,
      keywords,
      categoryId,
    })
    pageRef.current = nextPage
    setPosts(prev => {
      const seen = new Set(prev.map(p => p.id))
      return [...prev, ...data.filter(p => !seen.has(p.id))]
    })
    setHasMore(nextPage * PAGE_SIZE < total)
    setLoading(false)
  }

  // 哨兵元素进入视口时触发加载
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) loadMore()
      },
      { threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [keywords, categoryId, loading, hasMore])

  const empty = !loading && !hasMore && posts.length === 0

  return (
    <div className='flex flex-col gap-4'>
      {/* 帖子网格 */}
      {posts.length > 0 && (
        <div className={GRID}>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

      {/* 空状态 */}
      {empty && (
        <div className='py-20 text-center text-muted-foreground'>暂无内容</div>
      )}

      {/* 加载骨架 / 哨兵 */}
      {hasMore && (
        <div
          ref={sentinelRef}
          className={GRID}>
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 到底提示 */}
      {!hasMore && posts.length > 0 && (
        <div className='py-6 text-center text-sm text-muted-foreground'>
          没有更多了哦~
        </div>
      )}
    </div>
  )
}
