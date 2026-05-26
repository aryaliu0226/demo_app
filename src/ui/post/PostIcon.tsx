/** @format */
import {
  StarIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/16/solid'

export default function PostIcon({
  stars,
  likes,
  comments,
}: {
  stars: number
  likes: number
  comments: number
}) {
  return (
    <section className='flex h-10 items-center gap-3 px-3 text-sm text-zinc-800'>
      <div className='flex items-center justify-center gap-1'>
        <HeartIcon className='h-5 w-5' /> {likes}
      </div>
      <div className='flex items-center justify-center gap-1'>
        <StarIcon className='h-5 w-5' /> {stars}
      </div>
      <div className='flex items-center justify-center gap-1 '>
        <ChatBubbleOvalLeftIcon className='h-5 w-5' /> {comments}
      </div>
    </section>
  )
}
