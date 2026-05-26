/** @format */

import { getPostByIdApi } from '@/lib/post'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/ui/NavHeader'
import PostIcon from '@/ui/post/PostIcon'

// 格式化时间
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
  const post = await getPostByIdApi(id)
  console.log('Fetched post detail:', post) // 调试输出

  if (!post) notFound()

  const {
    title,
    content,
    pictures,
    video,
    stars,
    likes,
    createdAt,
    updatedAt,
    author,
    comments: commentsCount,
    commentList,
  } = post

  return (
    <main className='min-h-screen bg-zinc-50 text-zinc-900'>
      <Header
        title={title}
        url='/posts'
      />

      <div className='mx-auto max-w-3xl px-6 pb-20 pt-24'>
        {/* 标题区 */}
        <section className='mb-8'>
          {/* 发布状态 */}
          {!post.published && (
            <span className='mb-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700'>
              <span className='h-1.5 w-1.5 rounded-full bg-amber-500' />
              草稿
            </span>
          )}

          <h1 className='mb-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl'>
            {title}
          </h1>

          {/* 作者 & 时间 */}
          <div className='flex items-center gap-3'>
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.nickname}
                width={36}
                height={36}
                className='rounded-full object-cover ring-2 ring-zinc-200'
              />
            ) : (
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600'>
                {(author.name ?? author.nickname).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className='text-sm font-medium text-zinc-800'>
                {author.name ?? author.nickname}
              </p>
              <p className='text-xs text-zinc-400'>{formatDate(createdAt)}</p>
            </div>

            {/* 互动数据 */}
            <div className='ml-auto flex items-center gap-4 text-zinc-400'>
              <PostIcon
                stars={stars}
                likes={likes}
                comments={commentsCount}
              />
            </div>
          </div>
        </section>

        <hr className='mb-8 border-zinc-200' />

        {/* 视频 */}
        {video && (
          <div className='mb-8 overflow-hidden rounded-xl bg-black'>
            <video
              src={video}
              controls
              className='w-full max-h-[480px] object-contain'
            />
          </div>
        )}

        {/* 图片列表 */}
        {pictures && pictures.length > 0 && (
          <div
            className={`mb-8 grid gap-2 ${pictures.length === 1 ? 'grid-cols-1' : pictures.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {pictures.map((url, index) => (
              <div
                key={index}
                className='relative aspect-square overflow-hidden rounded-lg bg-zinc-100'>
                <Image
                  src={url}
                  alt={`图片 ${index + 1}`}
                  fill
                  className='object-cover transition-transform duration-300 hover:scale-105'
                />
              </div>
            ))}
          </div>
        )}

        {/* 正文内容 */}
        <section className='mb-12 leading-relaxed text-zinc-700'>
          {content ? (
            <div className='whitespace-pre-wrap text-[15px] leading-7'>
              {content}
            </div>
          ) : (
            <p className='text-zinc-400 italic'>暂无内容</p>
          )}
        </section>

        {/* 最后修改时间 */}
        {updatedAt > createdAt && (
          <p className='mb-10 text-xs text-zinc-400'>
            最后编辑于 {formatDate(updatedAt)}
          </p>
        )}

        <hr className='mb-8 border-zinc-200' />

        {/* 评论区 */}
        <section>
          <h2 className='mb-6 text-lg font-semibold text-zinc-800'>
            评论
            <span className='ml-2 text-sm font-normal text-zinc-400'>
              {commentsCount} 条
            </span>
          </h2>

          {commentList.length === 0 ? (
            <div className='rounded-xl border border-dashed border-zinc-200 py-12 text-center'>
              <p className='text-sm text-zinc-400'>
                暂无评论，快来发表第一条评论吧
              </p>
            </div>
          ) : (
            <ul className='space-y-4'>
              {commentList.map((comment, index) => (
                <li
                  key={comment.id}
                  className='rounded-xl border border-zinc-100 bg-white px-5 py-4 shadow-sm'>
                  <div className='mb-2 flex items-center gap-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500'>
                      {index + 1}
                    </div>
                    <span className='text-xs text-zinc-400'>
                      {comment.author.name ?? comment.author.nickname}
                    </span>
                  </div>
                  <p className='text-sm leading-relaxed text-zinc-700'>
                    {comment.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
