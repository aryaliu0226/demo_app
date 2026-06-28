/** @format */

import TopLogo from '@/app/_components/TopLogo'
import Image from 'next/image'
import bgImage from '@/public/bg.jpeg'
import AppLogo from '@/app/_components/AppLogo'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='w-full h-full flex overflow-hidden items-center justify-center bg-[#FBF7F0] '>
      <section className='relative flex min-h-full justify-center items-center min-h-[60dvh] flex-col  md:min-h-dvh md:basis-[60%] md:px-10 bg-gradient-to-br from-amber-50 via-[#FBF7F0] to-orange-100/60'>
        <div className='pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-200/40 blur-1xl' />
        <AppLogo></AppLogo>
        <TopLogo></TopLogo>
        {children}
      </section>
      <section className='relative min-h-[40dvh] overflow-hidden md:min-h-dvh md:basis-[40%]'>
        <Image
          src={bgImage}
          alt='宠物在户外休息'
          fill
          priority
          sizes='100vw'
          className='object-cover'
        />
      </section>
    </main>
  )
}
