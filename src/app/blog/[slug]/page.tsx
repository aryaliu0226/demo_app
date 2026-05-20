/** @format */

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

// 返回一个 `params` 列表来填充 [slug] 动态段
export async function generateStaticParams() {
  // const posts = await fetch('https://.../posts').then(res => res.json())
  const posts = [
    { slug: 'my-first-post', title: 'My First Post' },
    { slug: 'another-great-post', title: 'Another Great Post' },
    { slug: 'yet-another-post', title: 'Yet Another Post' },
  ]

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const title = slug
    .split('-')
    .filter(Boolean)
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <main className=''>
      <p className='text-sm font-medium text-zinc-500'>/blog/[slug] 嵌套路由</p>

      <h1 className='mt-3 text-4xl font-semibold tracking-tight text-zinc-950'>
        {title || 'Untitled Post'}
      </h1>
      <p className='mt-6 text-lg leading-8 text-zinc-600'>
        This dynamic route receives the current post identifier from
        params.slug. The current slug is{' '}
        <span className='font-mono'>{slug}</span>.
      </p>
    </main>
  )
}
