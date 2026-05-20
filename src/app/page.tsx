/** @format */

import Link from 'next/link'

export default async function Home() {
  return (
    <div className=''>
      <main className='flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start'>
        <h1>Wellow CongYo</h1>
        <section className='flex gap-8'>
          <Link href={'/blog'}>
            {' '}
            <h1>进入社区</h1>
          </Link>
          <Link href={'/signin'}>加入社区</Link>
        </section>
      </main>
    </div>
  )
}
