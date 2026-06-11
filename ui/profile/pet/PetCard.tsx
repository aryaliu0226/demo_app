/** @format */

import type { MyPet } from '@/lib/dal/pet'
import Avatar from '../../Avatar'

export default function PetCard({ pet }: { pet: MyPet }) {
  return (
    <div className='flex flex-col items-center gap-2 p-3 rounded-2xl bg-secondary hover:bg-hover transition cursor-pointer'>
      <Avatar
        avatarSrc={pet.avatar ?? ''}
        displayName={pet.name}
        size={66}
      />
      <div className='flex flex-col items-center gap-0.5 w-full'>
        <p className='text-sm font-medium text-foreground truncate max-w-full'>
          {pet.name}
        </p>
        <p className='text-xs text-muted-foreground'>
          {pet.category.name} · {pet.age}岁
        </p>
      </div>
    </div>
  )
}
