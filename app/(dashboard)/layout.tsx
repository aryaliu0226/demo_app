/** @format */

import { prismaGetLoginUser } from '@/app/_lib/dal/profile'
import { ProfileProvider } from '@/app/_components/profile/ProfilePrivider'
import AsideNav from '@/app/_components/aside/AsideNav'
import HeaderNav from '@/app/_components/header/HeaderNav'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await prismaGetLoginUser()
  return (
    <ProfileProvider profile={profile}>
      {/* 左侧固定侧边栏 */}
      <AsideNav />
      {/* 右侧：顶部导航栏 + 滚动内容区 */}
      {/* <main className='flex-1 min-h-full px-6 pb-10 overflow-y-auto'> */}
      {children}
      {/* </main> */}
    </ProfileProvider>
  )
}
