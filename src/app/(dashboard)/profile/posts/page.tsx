/** @format */

import { getMyPostsApi } from '@/lib/dal/profile'
import PostCard from '@/ui/post/PostCard'
import Link from 'next/link'
import type { Post } from '@/lib/dal/post'
import type { MyPost } from '@/lib/dal/profile'

export default async function ProfilePostsPage() {
  const { data: posts, total } = await getMyPostsApi({ pageNo: 1, pageSize: 20 })

  return (
    <div>
      {/* 标题 + 发布按钮 */}
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-zinc-800'>
          我的帖子
          <span className='ml-2 text-sm font-normal text-zinc-400'>{total} 篇</span>
        </h2>
        <Link
          href='/posts/new'
          className='rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800'>
          + 发布帖子
        </Link>
      </div>

      {/* 帖子列表 */}
      {posts.length === 0 ? (
        <div className='rounded-xl border border-dashed border-zinc-200 py-16 text-center'>
          <p className='text-sm text-zinc-400'>还没有发布过帖子，快去发布吧！</p>
          <Link
            href='/posts/new'
            className='mt-4 inline-block text-sm text-zinc-500 underline underline-offset-2 hover:text-zinc-800'>
            立即发布
          </Link>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post as unknown as Post}
            />
          ))}
        </div>
      )}
    </div>
  )
}
