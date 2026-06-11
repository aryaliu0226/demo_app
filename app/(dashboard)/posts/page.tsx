/** @format */

import PostList from '@/ui/post/PostList'
import PostCategoryTabs from '@/ui/post/PostCategoryTabs'
import HeaderNav from '@/ui/header/HeaderNav'

export default function PostsPage() {
  return (
    <>
      <HeaderNav />
      <section>
        <PostCategoryTabs />
        <PostList />
      </section>
    </>
  )
}
