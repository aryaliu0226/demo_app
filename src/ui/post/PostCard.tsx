/** @format */

import type { Post } from '@/lib/dal/post'
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

function getCoverColor(post: Post) {
  const seed = post.id
    .toString()
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return coverColors[seed % coverColors.length]
}

export default function PostCard({ post }: { post: Post }) {
  const authorName =
    post.author.name ||
    post.author.nickname ||
    post.author.account ||
    post.author.email ||
    '用户'
  const authorAvatar = post.author.avatar

  return (
    <Link
      href={`/posts/${post.id}`}
      className='block focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-300'>
      <article
        key={post.id}
        className='overflow-hidden rounded-lg border border-zinc-800 bg-dark-bg text-white shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-md'>
        <div className='aspect-[16/9] bg-dark-bg'>
          {post.pictures.length ? (
            <img
              src={post.pictures[0]}
              alt={post.title || 'Post cover'}
              className='h-full w-full object-cover'
            />
          ) : (
            <div
              className={`flex h-full items-center justify-center px-6 text-center font-semibold leading-7 ${getCoverColor(
                post,
              )}`}>
              <span className='line-clamp-3'>
                {post.title || 'Untitled Post'}
              </span>
            </div>
          )}
        </div>
        <div className='p-5'>
          {/* <div className='flex items-center justify-between gap-3 text-xs text-zinc-500'>
          <span>{post.creatorName}</span>
          <span>{post.createTime.slice(0, 10)}</span>
        </div> */}
          <h3 className='mt-3 line-clamp-2 overflow-hidden text-ellipsis text-lg font-semibold leading-6 text-white'>
            {post.title}
          </h3>
          {/* <p className='mt-3 line-clamp-3 text-sm leading-6 text-zinc-600'>
          {post.description}
        </p> */}
          <div className='mt-5 flex items-center justify-between gap-4 text-sm text-zinc-400'>
            <div className='flex min-w-0 items-center gap-2'>
              {authorAvatar ? (
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  width={32}
                  height={32}
                  className='h-8 w-8 shrink-0 rounded-full object-cover'
                />
              ) : (
                <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold text-zinc-600'>
                  {authorName.slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className='truncate'>{authorName}</span>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <HeartIcon className='h-6 w-6' />
              <span>{post.stars}</span>
            </div>

            {/* <span>
              {blog.like} <StarIcon></StarIcon>
            </span>
            <span>{blog.comment} comments</span> */}
          </div>
        </div>
      </article>
    </Link>
  )
}
