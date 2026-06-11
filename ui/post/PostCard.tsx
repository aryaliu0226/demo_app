/** @format */

import type { Post } from '@/lib/dal/post'
import { HeartIcon } from '@heroicons/react/16/solid'
import Image from 'next/image'
import Link from 'next/link'
import { defaultCardImage, defaultAvatorImage } from '@/config/global'
import Avatar from '../Avatar'

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
        className='overflow-hidden rounded-lg shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-600 hover:shadow-md'>
        <div className='aspect-[16/9] bg-dark-bg'>
          <img
            src={post?.pictures[0] || defaultCardImage}
            alt={post.title || 'Post cover'}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='p-5'>
          <h3 className='mt-3 line-clamp-2 text-lg leading-6'>{post.title}</h3>
          {/* <p className='mt-3 line-clamp-3 text-sm leading-6 text-zinc-600'>
          {post.description}
        </p> */}
          <div className='mt-5 flex items-center justify-between gap-4 text-sm text-zinc-400'>
            <div className='flex min-w-0 items-center gap-2'>
              {/* <Image
                src={authorAvatar || defaultAvatorImage}
                alt={authorName}
                width={46}
                height={46}
                className='h-8 w-8 shrink-0 rounded-full object-cover'
              /> */}
              <Avatar
                size={46}
                avatarSrc={authorAvatar || ''}
                displayName='图'></Avatar>
              <span className='truncate'>{authorName}</span>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <HeartIcon className='h-6 w-6' />
              <span>{post.likeCount}</span>
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
