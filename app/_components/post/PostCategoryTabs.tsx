/** @format */
'use client'

import { useEffect, useState } from 'react'
import type { Route } from 'next'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { fetchPetCategoriesAction } from '@/app/_lib/actions/pet'
import type { PetCategory } from '@/app/_lib/dal/pet'
import clsx from 'clsx'

export default function PostCategoryTabs() {
  const [categories, setCategories] = useState<PetCategory[]>([])
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const activeId = searchParams.get('categoryId') ?? ''

  useEffect(() => {
    fetchPetCategoriesAction().then(result => {
      if (result.success) {
        setCategories(result.data)
      } else {
        console.error(result.error)
      }
    })
  }, [])

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('categoryId', id)
    } else {
      params.delete('categoryId')
    }
    // 切换分类时重置搜索词
    // params.delete('keywords')
    router.push(`${pathname}?${params.toString()}` as Route)
  }

  if (!categories.length) return null

  const tabs = [{ id: '', name: '全部', label: 'all' }, ...categories]

  return (
    <div
      className='sticky top-0 min-w-full flex gap-2 overflow-x-auto pb-1 bg-background scrollbar-none'
      style={{ WebkitOverflowScrolling: 'touch' }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={clsx(
              'flex-shrink-0  px-3 py-1  font-medium transition-colors cursor-pointer',
              isActive
                ? 'border-b-2  border-primary text-primary'
                : 'text-muted-foreground hover:text-primary ',
            )}>
            {tab.name}
          </button>
        )
      })}
    </div>
  )
}
