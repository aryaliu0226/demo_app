/** @format */

import { prismaGetLoginUser } from '@/lib/dal/profile'
import { ProfileProvider } from '@/ui/profile/ProfilePrivider'
import AsideNav from '@/ui/aside/AsideNav'
import HeaderNav from '@/ui/header/HeaderNav'

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
