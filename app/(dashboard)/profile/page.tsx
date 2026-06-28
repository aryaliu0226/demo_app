/** @format */
import Pet from '@/app/_components/profile/pet/Pet'
import Profile from '@/app/_components/profile/Profile'
import Tabs from '@/app/_components/profile/tabs/Tabs'

export default function ProfilePage() {
  return (
    <main className='flex-1 min-h-full px-6 pb-10 overflow-y-auto'>
      <Profile />
      <Pet></Pet>
      <Tabs />
    </main>
  )
}
