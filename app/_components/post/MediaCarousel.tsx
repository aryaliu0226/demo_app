/** @format */
'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type Props = {
  pictures: string[]
  video?: string | null
}

export default function MediaCarousel({ pictures, video }: Props) {
  const items: { type: 'video' | 'image'; src: string }[] = [
    ...(video ? [{ type: 'video' as const, src: video }] : []),
    ...pictures.map(src => ({ type: 'image' as const, src })),
  ]

  const [index, setIndex] = useState(0)

  if (items.length === 0) return null

  const prev = () => setIndex(i => (i - 1 + items.length) % items.length)
  const next = () => setIndex(i => (i + 1) % items.length)
  const current = items[index]

  return (
    <div className='flex h-full flex-col'>
      {/* 主展示区 */}
      <div className='relative flex flex-1 items-center justify-center overflow-hidden bg-black'>
        {current.type === 'video' ? (
          <video
            key={current.src}
            src={current.src}
            controls
            className='max-h-full w-full object-contain'
          />
        ) : (
          <img
            key={current.src}
            src={current.src}
            alt=''
            className='max-h-full w-full object-contain'
          />
        )}

        {/* 翻页按钮 */}
        {items.length > 1 && (
          <>
            <button
              onClick={prev}
              className='absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60'>
              <ChevronLeftIcon className='h-5 w-5' />
            </button>
            <button
              onClick={next}
              className='absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/60'>
              <ChevronRightIcon className='h-5 w-5' />
            </button>
          </>
        )}

        {/* 页码指示器 */}
        {items.length > 1 && (
          <div className='absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5'>
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={[
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50',
                ].join(' ')}
              />
            ))}
          </div>
        )}
      </div>

      {/* 缩略图条 */}
      {items.length > 1 && (
        <div className='flex  gap-2 overflow-x-auto bg-black p-2 scrollbar-none'>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={[
                'h-14 w-14 shrink-0 overflow-hidden rounded transition',
                i === index
                  ? 'ring-2 ring-white'
                  : 'opacity-50 hover:opacity-80',
              ].join(' ')}>
              {item.type === 'video' ? (
                <div className='flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-white'>
                  视频
                </div>
              ) : (
                <img
                  src={item.src}
                  alt=''
                  className='h-full w-full object-cover'
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
