/** @format */
'use client'

import { useState, useTransition } from 'react'
import { deletePostAction } from '@/lib/actions/post'

export default function DeletePostButton({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePostAction(postId)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-500 transition hover:bg-red-500/10'>
        删除
      </button>

      {open && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className='w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl mx-4'>
            <h2 className='text-base font-semibold mb-2'>删除帖子</h2>
            <p className='text-sm text-muted-foreground mb-6'>
              确定要删除这篇帖子吗？删除后无法恢复。
            </p>

            {error && (
              <p className='mb-4 text-sm text-red-500'>{error}</p>
            )}

            <div className='flex gap-3'>
              <button
                type='button'
                onClick={() => { setOpen(false); setError('') }}
                className='flex-1 rounded-xl py-2.5 text-sm bg-hover text-foreground transition hover:opacity-80'>
                取消
              </button>
              <button
                type='button'
                onClick={handleDelete}
                disabled={isPending}
                className='flex-1 rounded-xl py-2.5 text-sm bg-red-500 text-white font-medium transition hover:bg-red-600 disabled:opacity-60'>
                {isPending ? '删除中…' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
