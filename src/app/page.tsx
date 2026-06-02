/** @format */

import Image from 'next/image'
import Link from 'next/link'
import bgImage from '@/assets/bg.jpeg'

export default async function Home() {
  return (
    <main className='relative isolate flex min-h-dvh w-full items-end overflow-hidden px-6 pb-16 pt-28 text-white sm:px-12 lg:px-20'>
      <Image
        src={bgImage}
        alt='宠物在户外休息'
        fill
        priority
        sizes='100vw'
        className='z-0 object-cover'
      />
      <div className='absolute inset-0 z-0 bg-gradient-to-t from-zinc-950/75 via-zinc-950/30 to-zinc-950/10' />

      <section className='relative z-10 max-w-3xl pb-10'>
        <h1 className='text-5xl font-semibold leading-tight sm:text-7xl'>
          宠友，有宠
        </h1>
        <p className='mt-5 max-w-xl text-base leading-7 text-zinc-100 sm:text-lg'>
          和同样爱宠物的人分享日常、记录成长，也发现更多有用的照顾经验。
        </p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <Link
            href='/posts'
            className='rounded-md bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100'>
            进入宠友圈
          </Link>
          <Link
            href='/login'
            className='rounded-md border border-white/50 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10'>
            加入社区
          </Link>
        </div>
      </section>
    </main>
  )
}
