/** @format */
'use client'

import { useRef, useState, useActionState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  updateProfileAction,
  type UpdateProfileState,
} from '@/app/_lib/actions/profile'
import type { Profile } from '@/app/_lib/dal/profile'
import EditAvatar from './EditAvatar'

type Props = {
  profile: Profile
  onClose: () => void
  onSuccess: (updated: Partial<Profile>) => void
}

export default function EditProfile({ profile, onClose, onSuccess }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string>(profile.avatar ?? '')
  const [uploading, setUploading] = useState(false)
  const nicknameRef = useRef<HTMLInputElement>(null)
  const briefRef = useRef<HTMLTextAreaElement>(null)
  const genderRef = useRef<HTMLSelectElement>(null)
  const birthdayRef = useRef<HTMLInputElement>(null)

  const [state, formAction, pending] = useActionState<
    UpdateProfileState,
    FormData
  >(updateProfileAction, null)

  // 把 avatarUrl 直接注入 FormData，避免依赖隐藏 input 的 DOM 同步时序
  function handleSubmit(formData: FormData) {
    formData.set('avatar', avatarUrl)
    return formAction(formData)
  }

  useEffect(() => {
    if (state?.success) {
      onSuccess({
        nickname: nicknameRef.current?.value || undefined,
        brief: briefRef.current?.value || undefined,
        avatar: avatarUrl || undefined,
        gender: (genderRef.current?.value as Profile['gender']) || undefined,
        birthday: birthdayRef.current?.value
          ? new Date(birthdayRef.current.value)
          : null,
      })
      onClose()
    }
  }, [state?.success])

  const displayName = profile.nickname ?? profile.name ?? profile.account
  const defaultBirthday = profile.birthday
    ? new Date(profile.birthday).toISOString().split('T')[0]
    : ''

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}>
      <div className='relative w-full max-w-xl rounded-2xl bg-card text-foreground shadow-xl mx-6'>
        {/* 顶部栏 */}
        <div className='flex items-center justify-end px-8 pt-5 pb-3 '>
          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-1 hover:bg-hover transition'>
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>

        {/* 表单 */}
        <form action={handleSubmit}>
          <div className='px-8 py-4 flex flex-col gap-5 max-h-[70vh] overflow-y-auto'>
            {/* 头像 */}
            <EditAvatar
              initialUrl={profile.avatar ?? ''}
              displayName={displayName}
              size={96}
              onChange={setAvatarUrl}
              onUploadingChange={setUploading}
            />

            {/* 昵称 */}
            <Field label='昵称'>
              <input
                ref={nicknameRef}
                name='nickname'
                type='text'
                maxLength={20}
                defaultValue={profile.nickname ?? ''}
                placeholder='最多 20 字'
                className='w-full rounded-xl bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring'
              />
            </Field>

            {/* 性别 */}
            <Field label='性别'>
              <select
                ref={genderRef}
                name='gender'
                defaultValue={profile.gender ?? ''}
                className='w-full rounded-xl bg-input px-4 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring'>
                <option value=''>请选择</option>
                {['男', '女'].map(opt => (
                  <option
                    key={opt}
                    value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Field>

            {/* 生日 */}
            <Field label='生日'>
              <input
                ref={birthdayRef}
                name='birthday'
                type='date'
                defaultValue={defaultBirthday}
                max={new Date().toISOString().split('T')[0]}
                className='w-full rounded-xl bg-input px-4 py-2.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring'
              />
            </Field>

            {/* 简介 */}
            <Field label='简介'>
              <textarea
                ref={briefRef}
                name='brief'
                maxLength={200}
                rows={4}
                defaultValue={profile.brief ?? ''}
                placeholder='最多 200 字'
                className='w-full rounded-xl bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring resize-none'
              />
            </Field>

            {state?.error && (
              <p className='text-sm text-destructive'>{state.error}</p>
            )}
          </div>

          {/* 底部按钮 */}
          <div className='flex gap-3 px-5 pb-5 pt-3 border-t border-border'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-xl py-2.5 text-sm bg-secondary text-foreground hover:bg-hover transition'>
              取消
            </button>
            <button
              type='submit'
              disabled={pending || uploading}
              className='flex-1 rounded-xl py-2.5 text-sm bg-primary text-background font-medium hover:opacity-90 transition disabled:opacity-50'>
              {pending ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-sm text-muted-foreground'>{label}</label>
      {children}
    </div>
  )
}
