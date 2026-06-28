/** @format */
'use client'

import { useActionState, useState } from 'react'
import { createPostAction, type CreatePostState } from '@/app/_lib/actions/post'
import MediaUpload from './MediaUpload'

type Category = {
  id: string
  name: string
  label: string
}

const initialState: CreatePostState = {}

export default function NewPostForm({
  categories,
}: {
  categories: Category[]
}) {
  const [state, formAction, pending] = useActionState(
    createPostAction,
    initialState,
  )
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  return (
    <form
      action={formAction}
      className='flex flex-col gap-5'>
      {/* ── 媒体上传 ─────────────────────────────────────── */}
      <MediaUpload onUploadingChange={setUploading} />

      {/* ── 作品描述 ─────────────────────────────────────── */}
      <span className='text-muted-foreground'>作品描述</span>
      <div className='flex flex-col rounded-xl bg-secondary'>
        <div className='border-b border-white/5 px-4 py-1'>
          <input
            id='title'
            name='title'
            type='text'
            placeholder='填写作品标题'
            className='w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none'
          />
          {state.errors?.title && (
            <p className='pb-1 text-xs text-red-400'>{state.errors.title[0]}</p>
          )}
        </div>
        <div className='px-4 py-1'>
          <textarea
            id='bref'
            name='bref'
            placeholder='添加作品简介'
            maxLength={300}
            rows={3}
            className='w-full resize-none bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none'
          />
          {state.errors?.bref && (
            <p className='pb-1 text-xs text-red-400'>{state.errors.bref[0]}</p>
          )}
        </div>
      </div>

      {/* ── 宠物分类 ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className='flex flex-col gap-2'>
          <div>
            <span className='text-muted-foreground'>宠物分类</span>
            <span className='ml-1 text-xs text-muted-foreground'>
              (精准匹配同好宠友)
            </span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {categories.map(c => {
              const active = selectedCategory === c.id
              return (
                <button
                  key={c.id}
                  type='button'
                  onClick={() => setSelectedCategory(active ? '' : c.id)}
                  className={`rounded px-4 py-1.5 text-sm transition ${
                    active
                      ? 'bg-foreground text-background'
                      : 'bg-secondary text-muted-foreground hover:bg-hover'
                  }`}>
                  {c.name}
                </button>
              )
            })}
          </div>
          <input
            type='hidden'
            name='categoryId'
            value={selectedCategory}
          />
        </div>
      )}

      {state.message && (
        <p className='rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400'>
          {state.message}
        </p>
      )}

      {/* ── 提交 ─────────────────────────────────────────── */}
      <div className='flex gap-4'>
        <button
          type='submit'
          name='published'
          value='true'
          disabled={pending || uploading}
          className='flex-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50'>
          {pending ? '提交中…' : '发布作品'}
        </button>
        <button
          type='submit'
          name='published'
          value='false'
          disabled={pending || uploading}
          className='flex-1 rounded-xl bg-secondary text-muted-foreground hover:bg-hover py-3 text-sm font-semibold transition disabled:opacity-50'>
          {pending ? '保存中...' : '存为草稿'}
        </button>
      </div>
    </form>
  )
}
