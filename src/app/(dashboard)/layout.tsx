/** @format */

import { getLoginUser } from '@/lib/dal/profile'
import { ProfileProvider } from '@/ui/profile/ProfilePrivider'
import AsideNav from '@/ui/aside/AsideNav'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await getLoginUser()
  return (
    <ProfileProvider profile={profile}>
      <main className='w-screen h-screen flex overflow-hidden'>
        {/* 左侧固定侧边栏 */}
        <AsideNav />
        {/* 右侧：顶部导航栏 + 滚动内容区 */}
        <section className='w-full min-h-full px-6 pb-10 overflow-y-auto overflow-x-hidden'>
          {children}
        </section>
      </main>
    </ProfileProvider>
  )
}
