/** @format */

'use client'

import { useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import throttle from 'lodash/throttle'

export default function ScrollPage({
  children,
  total,
}: {
  children: React.ReactNode
  total: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageNoRef = useRef<number>(Number(searchParams.get('pageNo') ?? 1))
  const [isPending, startTransition] = useTransition() // ✅ 自动追踪服务端请求状态

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (isPending || 20 * pageNoRef.current >= total) return // ✅ 用 isPending 替代 isFetchingRef

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        pageNoRef.current += 1
        const params = new URLSearchParams(window.location.search)
        params.set('pageNo', String(pageNoRef.current))

        startTransition(() => {
          // ✅ 包裹导航，触发 pending 状态
          router.replace(`?${params.toString()}`, { scroll: false })
        })
      }
    }, 500)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      handleScroll.cancel()
    }
  }, [router, total, isPending])

  return (
    <div className='w-full'>
      {children}
      {isPending && ( // ✅ 直接用 isPending 渲染加载提示
        <div className='flex h-16 items-center justify-center text-zinc-400'>
          加载中...
        </div>
      )}
    </div>
  )
}
