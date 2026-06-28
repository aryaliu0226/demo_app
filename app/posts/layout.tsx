/** @format */
import HeaderLink from '@/app/_components/HeaderLink'

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
