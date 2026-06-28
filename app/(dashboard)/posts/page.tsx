/** @format */

import PostList from '@/app/_components/post/PostList'
import PostCategoryTabs from '@/app/_components/post/PostCategoryTabs'
import HeaderNav from '@/app/_components/header/HeaderNav'

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
