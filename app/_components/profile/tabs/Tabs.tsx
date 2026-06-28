/** @format */
'use client'

import { useState } from 'react'
import Posts from './Posts'
import Favorite from './Favorite'
import Liked from './Liked'

const TABS = [
  { key: 'posts', label: '帖子' },
  { key: 'favorite', label: '收藏' },
  { key: 'liked', label: '点赞' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function Tabs() {
  const [active, setActive] = useState<TabKey>('posts')

  return (
    <div className='rounded-2xl overflow-hidden'>
      {/* Tab 切换栏 */}
      <div className='flex border-b border-border'>
        {TABS.map(tab => (
          <button
            key={tab.key}
            type='button'
            onClick={() => setActive(tab.key)}
            className={[
              'flex-1 py-3 text-sm transition-colors',
              active === tab.key
                ? 'font-medium border-b-2 border-foreground text-foreground -mb-px'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      <div className='pt-4'>
        {active === 'posts' && <Posts />}
        {active === 'favorite' && <Favorite />}
        {active === 'liked' && <Liked />}
      </div>
    </div>
  )
}
