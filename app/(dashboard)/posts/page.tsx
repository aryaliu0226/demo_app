/** @format */

import PostList from '@/ui/post/PostList'
import PostCategoryTabs from '@/ui/post/PostCategoryTabs'
import HeaderNav from '@/ui/header/HeaderNav'

export default function PostsPage() {
  return (
    <main className='flex-1 min-h-full px-6 pb-10 overflow-y-auto'>
      <HeaderNav />
      <section>
        <PostCategoryTabs />
        <PostList />
      </section>
    </main>
  )
}
