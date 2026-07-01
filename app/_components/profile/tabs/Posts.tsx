/** @format */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchMyPostsAction } from '@/app/_lib/actions/profile'
import type { MyPost } from '@/app/_lib/dal/profile'

export default function ProfilePosts() {
  const [posts, setPosts] = useState<MyPost[] | null>(null)

  useEffect(() => {
    fetchMyPostsAction().then(result => {
      if (result.success) {
        setPosts(result.data.data)
      } else {
        console.error(result.error)
        setPosts([])
      }
    })
  }, [])

  if (posts === null) {
    return (
      <div className='grid grid-cols-3 gap-1'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='aspect-square rounded-lg bg-hover animate-pulse' />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className='py-16 text-center text-sm text-muted-foreground'>
        还没有发布过帖子
      </div>
    )
  }

  return (
    <div className='grid grid-cols-3 gap-1'>
      {posts.map(post => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className='relative aspect-square overflow-hidden rounded-lg bg-hover block'>
          {post.pictures?.[0] ? (
            <Image
              src={post.pictures[0]}
              alt={post.title}
              fill
              className='object-cover transition-transform hover:scale-105'
            />
          ) : (
            <div className='flex h-full items-center justify-center p-2'>
              <p className='line-clamp-3 text-center text-xs text-muted-foreground'>
                {post.title}
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
