/** @format */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchMyFavoritePostsAction } from '@/lib/actions/profile'
import type { FavoritePost } from '@/lib/dal/profile'

export default function Favorite() {
  const [items, setItems] = useState<FavoritePost[] | null>(null)

  useEffect(() => {
    fetchMyFavoritePostsAction().then(setItems)
  }, [])

  if (items === null) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='flex gap-3'>
            <div className='w-14 h-14 rounded-lg bg-hover animate-pulse shrink-0' />
            <div className='flex-1 space-y-2 py-1'>
              <div className='h-3 bg-hover rounded animate-pulse w-3/4' />
              <div className='h-3 bg-hover rounded animate-pulse w-1/2' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className='py-16 text-center text-sm text-muted-foreground'>
        还没有收藏过帖子
      </div>
    )
  }

  return (
    <ul className='divide-y divide-border'>
      {items.map(({ post }) => {
        const authorName = post.author.nickname ?? post.author.name ?? post.author.account
        return (
          <li key={post.id}>
            <Link
              href={`/posts/${post.id}`}
              className='flex items-center gap-3 py-3 hover:opacity-80 transition'>
              <div className='relative w-14 h-14 rounded-lg overflow-hidden bg-hover shrink-0'>
                {post.pictures?.[0] ? (
                  <Image
                    src={post.pictures[0]}
                    alt={post.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <span className='text-xs text-muted-foreground line-clamp-2 text-center p-1'>
                      {post.title}
                    </span>
                  </div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{post.title}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {authorName} · {post.stars} 收藏
                </p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
