/** @format */

import PostList from '@/ui/post/PostList'
import HeaderNav from '@/ui/header/HeaderNav'
import PostCategoryTabs from '@/ui/post/PostCategoryTabs'

export default function PostsPage() {
  return (
    <>
      <HeaderNav />
      <section className='px-4 py-6'>
        <PostCategoryTabs />
        <PostList />
      </section>
    </>
  )
}
