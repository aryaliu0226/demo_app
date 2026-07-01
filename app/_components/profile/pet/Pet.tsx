/** @format */
'use client'

import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { fetchMyPetsAction } from '@/app/_lib/actions/pet'
import type { MyPet } from '@/app/_lib/dal/pet'
import PetCard from './PetCard'
import AddPetModal from './AddPetModal'

export default function Pet() {
  const [pets, setPets] = useState<MyPet[] | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    fetchMyPetsAction().then(result => {
      if (result.success) {
        setPets(result.data)
      } else {
        console.error(result.error)
        setPets([])
      }
    })
  }, [])

  function handleAddSuccess(pet: MyPet) {
    setPets(prev => [...(prev ?? []), pet])
  }

  // 加载中：占位骨架
  if (pets === null) {
    return (
      <section className='mt-2 mb-6'>
        <div className='flex gap-3'>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className='w-24 h-24 rounded-2xl bg-secondary animate-pulse'
            />
          ))}
        </div>
      </section>
    )
  }

  // 无宠物：引导添加
  if (pets.length === 0) {
    return (
      <section className='mt-2 mb-6'>
        <button
          type='button'
          onClick={() => setAddOpen(true)}
          className='flex items-center gap-2 px-4 py-2.5 rounded border border-dashed border-primary text-primary hover:bg-primary/10 transition text-sm'>
          <PlusIcon className='w-4 h-4 text-primary' />
          添加爱宠
        </button>
        {addOpen && (
          <AddPetModal
            onClose={() => setAddOpen(false)}
            onSuccess={handleAddSuccess}
          />
        )}
      </section>
    )
  }

  return (
    <section className='mt-2 mb-6'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-sm text-muted-foreground'>我的爱宠</h2>
        <button
          type='button'
          onClick={() => setAddOpen(true)}
          className='flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition'>
          <PlusIcon className='w-3.5 h-3.5' />
          添加
        </button>
      </div>
      <div className='flex flex-wrap gap-3'>
        {pets.map(pet => (
          <div key={pet.id} className='w-24'>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
      {addOpen && (
        <AddPetModal
          onClose={() => setAddOpen(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </section>
  )
}
