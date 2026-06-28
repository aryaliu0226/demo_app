/** @format */

import { prismaGetPostById } from '@/app/_lib/dal/post'
import { getOptionalUserId } from '@/app/_lib/auth'
import { prismaGetIsFollowing } from '@/app/_lib/dal/follow'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import MediaCarousel from '@/app/_components/post/MediaCarousel'
import FollowButton from '@/app/_components/FollowButton'
import PostIcon from '@/app/_components/post/PostIcon'
import Avatar from '@/app/_components/Avatar'
import DeletePostButton from '@/app/_components/post/DeletePostButton'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [post, loginUserId] = await Promise.all([
    prismaGetPostById(id),
    getOptionalUserId(),
  ])
  if (!post) notFound()

  const {
    title,
    content,
    pictures,
    video,
    stars,
    likeCount,
    createdAt,
    author,
    comments: commentsCount,
    commentList,
  } = post

  const authorName = author.name ?? author.nickname ?? author.account
  const hasMedia = video || pictures.length > 0
  const isOwner = loginUserId === post.authorId
  const isSelf = isOwner
  const initialLiked = loginUserId
    ? post.likes.some(like => like.userId === loginUserId)
    : false
  const initialFavorited = loginUserId
    ? post.favorites.some(favorite => favorite.userId === loginUserId)
    : false
  const isFollowing = loginUserId && !isOwner
    ? await prismaGetIsFollowing(loginUserId, author.id)
    : false

  return (
    <div className='h-screen w-screen flex flex-col overflow-hidden md:flex-row'>
      {hasMedia && (
        <div className='h-[50vh] w-full overflow-hidden bg-black md:h-full md:flex-1'>
          <MediaCarousel pictures={pictures} video={video} />
        </div>
      )}

      {/* 右侧：信息 + 评论 */}
      <div className='flex flex-1 flex-col overflow-hidden border-t border-border bg-background md:flex-none md:border-l md:border-t-0 md:w-[clamp(400px,30%,600px)]'>
        {/* 作者信息 */}
        <div className='flex items-center gap-3 border-b border-border p-4'>
          <Avatar size={56} avatarSrc={author.avatar || ''} displayName={authorName} />
          <div className='min-w-0 flex-1'>
            <p className='text-lg font-semibold'>{authorName}</p>
          </div>
          {isOwner ? (
            <DeletePostButton postId={post.id} />
          ) : (
            !isSelf && (
              <FollowButton targetId={author.id} initialFollowing={isFollowing} />
            )
          )}
        </div>

        {/* 标题 + 正文 */}
        <div className='border-b border-border p-4'>
          <h1 className='mb-2 text-lg font-semibold leading-snug'>{title}</h1>
          {content && (
            <p className='whitespace-pre-wrap leading-relaxed text-muted-foreground'>
              {content}
            </p>
          )}
          <div className='flex items-center justify-between gap-4 mt-4 text-sm'>
            <p className='text-sm text-muted-foreground'>{formatDate(createdAt)}</p>
            <PostIcon
              postId={post.id}
              stars={stars}
              likes={likeCount}
              comments={commentsCount}
              initialLiked={initialLiked}
              initialFavorited={initialFavorited}
            />
          </div>
        </div>

        {/* 评论列表 */}
        <div className='flex-1 overflow-y-auto p-4'>
          <p className='mb-3 text-sm font-medium text-muted-foreground'>
            {commentsCount} 条评论
          </p>
          {commentList.length === 0 ? (
            <p className='py-10 text-center text-sm text-muted-foreground'>暂无评论</p>
          ) : (
            <ul className='space-y-5'>
              {commentList.map(comment => {
                const name =
                  comment.author.name ?? comment.author.nickname ?? comment.author.account
                return (
                  <li key={comment.id} className='flex gap-3'>
                    {comment.author.avatar ? (
                      <Image
                        src={comment.author.avatar}
                        alt={name}
                        width={32}
                        height={32}
                        className='h-8 w-8 shrink-0 rounded-full object-cover'
                      />
                    ) : (
                      <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hover text-xs font-semibold'>
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className='min-w-0'>
                      <p className='mb-0.5 text-xs font-medium'>{name}</p>
                      <p className='text-sm leading-relaxed text-muted-foreground'>
                        {comment.content}
                      </p>
                      <p className='mt-1 text-xs text-muted-foreground/60'>
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
