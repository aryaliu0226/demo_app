/** @format */
'use client'

import { useState, useTransition } from 'react'
import {
  togglePostFavoriteAction,
  togglePostLikeAction,
} from '@/app/_lib/actions/post'
import {
  StarIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/16/solid'

export default function PostIcon({
  postId,
  stars,
  likes,
  comments,
  initialLiked,
  initialFavorited,
}: {
  postId: string
  stars: number
  likes: number
  comments: number
  initialLiked: boolean
  initialFavorited: boolean
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [favorited, setFavorited] = useState(initialFavorited)
  const [favoriteCount, setFavoriteCount] = useState(stars)
  const [isLikePending, startLikeTransition] = useTransition()
  const [isFavoritePending, startFavoriteTransition] = useTransition()

  function handleToggleLike() {
    const nextLiked = !liked
    const previousLiked = liked
    const previousLikeCount = likeCount

    setLiked(nextLiked)
    setLikeCount(count => count + (nextLiked ? 1 : -1))

    startLikeTransition(async () => {
      const result = await togglePostLikeAction(postId)
      if ('error' in result) {
        setLiked(previousLiked)
        setLikeCount(previousLikeCount)
        return
      }

      setLiked(result.liked)
      setLikeCount(result.likeCount)
    })
  }

  function handleToggleFavorite() {
    const nextFavorited = !favorited
    const previousFavorited = favorited
    const previousFavoriteCount = favoriteCount

    setFavorited(nextFavorited)
    setFavoriteCount(count => count + (nextFavorited ? 1 : -1))

    startFavoriteTransition(async () => {
      const result = await togglePostFavoriteAction(postId)
      if ('error' in result) {
        setFavorited(previousFavorited)
        setFavoriteCount(previousFavoriteCount)
        return
      }

      setFavorited(result.favorited)
      setFavoriteCount(result.stars)
    })
  }

  return (
    <section className='flex h-10 items-center gap-3 px-3 text-sm '>
      <button
        type='button'
        onClick={handleToggleLike}
        disabled={isLikePending}
        aria-pressed={liked}
        aria-label={liked ? '取消点赞' : '点赞'}
        className='flex items-center justify-center gap-1 rounded-sm transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-70'>
        <HeartIcon className={`h-5 w-5 ${liked ? 'text-red-500' : ''}`} />
        {likeCount}
      </button>
      <button
        type='button'
        onClick={handleToggleFavorite}
        disabled={isFavoritePending}
        aria-pressed={favorited}
        aria-label={favorited ? '取消收藏' : '收藏'}
        className='flex items-center justify-center gap-1 rounded-sm transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-70'>
        <StarIcon className={`h-5 w-5 ${favorited ? 'text-primary' : ''}`} />
        {favoriteCount}
      </button>
      <div className='flex items-center justify-center gap-1 '>
        <ChatBubbleOvalLeftIcon className='h-5 w-5' /> {comments}
      </div>
    </section>
  )
}
