/** @format */
'use client'

import { useState, useActionState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  createPetAction,
  fetchPetCategoriesAction,
  type CreatePetState,
} from '@/app/_lib/actions/pet'
import type { MyPet, PetCategory } from '@/app/_lib/dal/pet'
import EditAvatar from '../EditAvatar'

type Props = {
  onClose: () => void
  onSuccess: (pet: MyPet) => void
}

export default function AddPetModal({ onClose, onSuccess }: Props) {
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<PetCategory[]>([])

  // 拉取宠物类别
  useEffect(() => {
    fetchPetCategoriesAction().then(setCategories)
  }, [])

  const [state, formAction, pending] = useActionState<CreatePetState, FormData>(
    createPetAction,
    null,
  )

  // 成功后通知父组件
  useEffect(() => {
    if (state?.pet) {
      onSuccess(state.pet)
      onClose()
    }
  }, [state?.pet])

  function handleSubmit(formData: FormData) {
    formData.set('avatar', avatarUrl)
    return formAction(formData)
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}>
      <div className='relative w-full max-w-sm rounded-2xl bg-card text-foreground shadow-xl mx-4'>
        {/* 顶部 */}
        <div className='flex items-center justify-between px-5 pt-5 pb-3 border-b border-border'>
          <h2 className='text-base font-semibold'>添加爱宠</h2>
          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-1 hover:bg-hover transition'>
            <XMarkIcon className='w-5 h-5' />
          </button>
        </div>

        <form action={handleSubmit}>
          <div className='px-5 py-4 flex flex-col gap-4'>
            {/* 头像 */}
            <EditAvatar
              displayName='宠'
              size={72}
              onChange={setAvatarUrl}
              onUploadingChange={setUploading}
            />

            {/* 名字 */}
            <Field label='名字'>
              <input
                name='name'
                type='text'
                maxLength={20}
                placeholder='请输入宠物名字'
                required
                className='input-field'
              />
            </Field>

            {/* 出生日期 */}
            <Field label='出生日期'>
              <input
                name='birthDate'
                type='date'
                required
                className='input-field'
              />
            </Field>

            {/* 类别 */}
            <Field label='类别'>
              <select
                name='categoryId'
                required
                defaultValue=''
                className='input-field'>
                <option
                  value=''
                  disabled>
                  请选择类别
                </option>
                {categories.map(c => (
                  <option
                    key={c.id}
                    value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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
              className='flex-1 rounded-xl py-2.5 text-sm bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50'>
              {pending ? '添加中…' : '添加'}
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
