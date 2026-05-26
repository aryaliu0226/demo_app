/** @format */

import HeaderNav from '@/ui/header/HeaderNav'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <HeaderNav />
      {children}
    </>
  )
}
