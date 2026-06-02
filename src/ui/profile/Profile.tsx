/** @format */

'use client'

import { useActionState, useState, useEffect } from 'react'
import Image from 'next/image'
import { useProfile } from './ProfilePrivider'
import { updateProfile, type UpdateProfileState } from '@/lib/actions/profile'

// ─── Field 辅助组件 ───────────────────────────────────────────────────────────
function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  multiline = false,
  fullWidth = false,
}: {
  label: string
  name: string
  defaultValue: string
  type?: string
  multiline?: boolean
  fullWidth?: boolean
}) {
  const inputClass =
    'w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'

  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <label className='mb-1.5 block text-sm font-medium text-zinc-700'>
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          className={inputClass}
        />
      )}
    </div>
  )
}

// ─── Profile 主组件 ───────────────────────────────────────────────────────────
export default function Profile() {
  const profile = useProfile()

  const [editing, setEditing] = useState(false)
  const [state, formAction, pending] = useActionState<
    UpdateProfileState,
    FormData
  >(updateProfile, null)

  // 保存成功后自动关闭编辑面板
  useEffect(() => {
    if (state?.success) setEditing(false)
  }, [state])

  if (!profile) return null

  const displayName = profile.nickname ?? profile.name ?? profile.account
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className='mb-8 rounded-2xl  p-6 shadow-sm'>
      {/* ── 头像 + 信息 + 操作按钮 ─────────────────────────── */}
      <div className='flex items-start gap-5'>
        {/* 头像 */}
        <div className='relative shrink-0'>
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={displayName}
              width={80}
              height={80}
              className='h-20 w-20 rounded-full object-cover ring-2 ring-zinc-200'
            />
          ) : (
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-zinc-200 text-2xl font-bold text-zinc-600'>
              {initials}
            </div>
          )}
          {/* 更换头像入口（点击进入编辑模式） */}
          <button
            type='button'
            title='更换头像'
            onClick={() => setEditing(true)}
            className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs text-white shadow transition hover:bg-zinc-700'>
            ✎
          </button>
        </div>

        {/* 昵称 / 账号 / 简介 / 统计 */}
        <div className='min-w-0 flex-1'>
          <h2 className='truncate text-xl font-bold text-zinc-900'>
            {displayName}
          </h2>
          <p className='text-sm text-zinc-400'>@{profile.account}</p>
          {profile.brief && (
            <p className='mt-1 line-clamp-2 text-sm text-zinc-600'>
              {profile.brief}
            </p>
          )}

          {/* 统计数据 */}
          <div className='mt-3 flex gap-5 text-sm'>
            <span>
              <span className='font-semibold text-zinc-900'>
                {profile.stars}
              </span>
              <span className='ml-1 text-zinc-400'>获赞</span>
            </span>
            <span>
              <span className='font-semibold text-zinc-900'>
                {profile.followerCount}
              </span>
              <span className='ml-1 text-zinc-400'>粉丝</span>
            </span>
            <span>
              <span className='font-semibold text-zinc-900'>
                {profile.followingCount}
              </span>
              <span className='ml-1 text-zinc-400'>关注</span>
            </span>
          </div>
        </div>

        {/* 编辑 / 取消按钮 */}
        <button
          type='button'
          onClick={() => setEditing(v => !v)}
          className='shrink-0 rounded-lg border border-zinc-200 px-4 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-50'>
          {editing ? '取消' : '编辑资料'}
        </button>
      </div>

      {/* ── 编辑表单 ──────────────────────────────────────── */}
      {editing && (
        <form
          action={formAction}
          className='mt-6 space-y-4 border-t border-zinc-100 pt-6'>
          {/* 错误提示 */}
          {state?.error && (
            <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
              {state.error}
            </p>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <Field
              label='昵称'
              name='nickname'
              defaultValue={profile.nickname ?? ''}
            />
            <Field
              label='姓名'
              name='name'
              defaultValue={profile.name ?? ''}
            />
            <Field
              label='邮箱'
              name='email'
              type='email'
              defaultValue={profile.email ?? ''}
            />
            <Field
              label='手机号'
              name='phone'
              defaultValue={profile.phone ?? ''}
            />
            <Field
              label='个人简介'
              name='brief'
              defaultValue={profile.brief ?? ''}
              multiline
              fullWidth
            />
          </div>

          <div className='flex items-center gap-3'>
            <button
              type='submit'
              disabled={pending}
              className='rounded-xl bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60'>
              {pending ? '保存中…' : '保存'}
            </button>
            <button
              type='button'
              onClick={() => setEditing(false)}
              className='text-sm text-zinc-400 transition hover:text-zinc-600'>
              取消
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
