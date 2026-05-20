/** @format */

import { Blog } from '@/lib/data'
import { HeartIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import Link from 'next/link'

const coverColors = [
  'bg-rose-200 text-rose-950',
  'bg-amber-200 text-amber-950',
  'bg-lime-200 text-lime-950',
  'bg-emerald-200 text-emerald-950',
  'bg-sky-200 text-sky-950',
  'bg-violet-200 text-violet-950',
]

function getCover(blog: Blog) {
  return blog.pictures[0]?.[0]
}

function getCoverColor(blog: Blog) {
  const seed = blog.id
    .toString()
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return coverColors[seed % coverColors.length]
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const cover = getCover(blog)

  return (
    <article
      key={blog.id}
      className='overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md'>
      <div className='aspect-[16/9] bg-zinc-200'>
        {cover ? (
          <img
            src={cover}
            alt={blog.title || 'Blog cover'}
            className='h-full w-full object-cover'
          />
        ) : (
          <div
            className={`flex h-full items-center justify-center px-6 text-center text-lg font-semibold leading-7 ${getCoverColor(
              blog,
            )}`}>
            <span className='line-clamp-3'>
              {blog.title || 'Untitled Blog'}
            </span>
          </div>
        )}
      </div>
      <div className='p-5'>
        {/* <div className='flex items-center justify-between gap-3 text-xs text-zinc-500'>
          <span>{blog.creatorName}</span>
          <span>{blog.createTime.slice(0, 10)}</span>
        </div> */}
        <h3 className='mt-3 line-clamp-2 text-lg font-semibold leading-6'>
          <Link href={`/blog/${blog.id}`}>{blog.title}</Link>
        </h3>
        {/* <p className='mt-3 line-clamp-3 text-sm leading-6 text-zinc-600'>
          {blog.des}
        </p> */}
        <div className='mt-5 flex items-center justify-between gap-4 text-sm text-zinc-500'>
          <div className='flex min-w-0 items-center gap-2'>
            <Image
              src={blog.creatorAvatar}
              alt={blog.creatorName}
              width={32}
              height={32}
              className='h-8 w-8 shrink-0 rounded-full object-cover'
            />
            <span className='truncate'>{blog.creatorName}</span>
          </div>
          <div className='flex shrink-0 items-center gap-1'>
            <HeartIcon className='h-6 w-6' />
            <span>{blog.star}</span>
          </div>

          {/* <span>
            {blog.like} <StarIcon></StarIcon>
          </span>
          <span>{blog.comment} comments</span> */}
        </div>
      </div>
    </article>
  )
}
