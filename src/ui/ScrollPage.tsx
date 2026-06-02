/** @format */

'use client'

import { useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PAGE_SIZE = 20

export default function ScrollPage({
  children,
  total,
}: {
  children: React.ReactNode
  total: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageNoRef = useRef(Number(searchParams.get('pageNo') ?? 1))
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false) // 用 ref 而非 state 避免重建 observer
  const [isPending, startTransition] = useTransition() // 仅用于渲染加载提示

  // 刷新时重置回第 1 页，避免直接显示中间某页的少量数据
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (Number(params.get('pageNo') ?? 1) > 1) {
      params.set('pageNo', '1')
      pageNoRef.current = 1
      router.replace(`?${params.toString()}`, { scroll: false })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (loadingRef.current) return
        if (pageNoRef.current * PAGE_SIZE >= total) return

        loadingRef.current = true
        pageNoRef.current += 1
        const params = new URLSearchParams(window.location.search)
        params.set('pageNo', String(pageNoRef.current))
        startTransition(() => {
          router.replace(`?${params.toString()}`, { scroll: false })
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [router, total]) // 不再依赖 isPending，observer 只建一次

  // 请求完成后重置 loading 标志
  useEffect(() => {
    if (!isPending) loadingRef.current = false
  }, [isPending])

  return (
    <>
      {children}
      {/* <div ref={sentinelRef}> 哨兵，IntersectionObserver 感知它进入视口就触发翻页，与滚动容器是谁无关 */}
      <div
        ref={sentinelRef}
        className='h-2'
      />
      {isPending && (
        <div className='flex h-16 items-center justify-center text-sm text-muted-foreground'>
          加载中...
        </div>
      )}
    </>
  )
}
