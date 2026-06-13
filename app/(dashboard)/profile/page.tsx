/** @format */
import Pet from '@/ui/profile/pet/Pet'
import Profile from '@/ui/profile/Profile'
import Tabs from '@/ui/profile/tabs/Tabs'

export default function ProfilePage() {
  return (
    <main className='flex-1 min-h-full px-6 pb-10 overflow-y-auto'>
      <Profile />
      <Pet></Pet>
      <Tabs />
    </main>
  )
}
