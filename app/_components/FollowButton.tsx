/** @format */
'use client'

import { useState, useTransition } from 'react'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { toggleFollowAction } from '@/app/_lib/actions/follow'

export default function FollowButton({
  targetId,
  initialFollowing,
}: {
  targetId: string
  initialFollowing: boolean
}) {
  const [following, setFollowing] = useState(initialFollowing)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFollowAction(targetId)
      if (result.redirectUrl) {
        router.push(result.redirectUrl as Route)
        return
      }
      if (result.error) {
        console.error(result.error)
        return
      }
      setFollowing(result.following)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={[
        'ml-auto shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all',
        following
          ? 'border border-border text-muted-foreground hover:border-destructive hover:text-destructive'
          : 'bg-primary text-primary-foreground hover:opacity-90',
        isPending ? 'opacity-50 cursor-not-allowed' : '',
      ].join(' ')}>
      {isPending ? '...' : following ? '已关注' : '关注'}
    </button>
  )
}
