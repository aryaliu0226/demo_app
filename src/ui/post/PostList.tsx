/** @format */

import type { Post } from '@/lib/post'
import PostCard from '@/ui/post/PostCard'
export default async function PostList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return (
      <div className='flex  items-center justify-center px-6 text-center'>
        暂无
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {posts.map(post => (
        <PostCard
          post={post}
          key={post.id}
        />
      ))}
    </div>
  )
}
