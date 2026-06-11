/** @format */
import HeaderLink from '@/ui/HeaderLink'

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderLink title=''></HeaderLink>
      {children}
    </>
  )
}
