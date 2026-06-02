/** @format */

import Profile from '@/ui/profile/Profile'

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='p-6'>
      {/* 111 */}
      {/* <Profile /> */}
      {children}
    </div>
  )
}
