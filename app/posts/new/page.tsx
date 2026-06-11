/** @format */

import { prismaGetCategories } from '@/lib/dal/post'
import { verifyAuth } from '@/lib/auth'
import NewPostForm from '@/ui/post/NewPostForm'

export default async function NewPostPage() {
  await verifyAuth()
  const categories = await prismaGetCategories()

  return (
    <main className='w-screen h-screen flex px-4 pt-20 pb-12'>
      <div className='mx-auto max-w-xl'>
        <h1 className='mb-8 text-xl font-bold text-foreground'>发布帖子</h1>
        <NewPostForm categories={categories} />
      </div>
    </main>
  )
}
