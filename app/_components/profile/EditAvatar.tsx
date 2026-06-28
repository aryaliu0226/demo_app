/** @format */
'use client'

import { useRef, useState } from 'react'
import { CameraIcon } from '@heroicons/react/24/outline'
import Avatar from '../Avatar'
import { normalizeImage, uploadToOSS } from '@/app/_lib/upload'

type Props = {
  /** 初始头像 URL（已有头像时传入） */
  initialUrl?: string
  /** 头像占位文字（无图时显示首字母） */
  displayName?: string
  /** 头像尺寸 px，默认 96 */
  size?: number
  /** 上传完成，返回新 URL */
  onChange: (url: string) => void
  /** 上传状态变化通知，用于父组件禁用提交按钮 */
  onUploadingChange?: (uploading: boolean) => void
}

export default function EditAvatar({
  initialUrl = '',
  displayName = '',
  size = 96,
  onChange,
  onUploadingChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)
    onUploadingChange?.(true)

    try {
      const normalized = await normalizeImage(file)
      const url = await uploadToOSS(normalized)
      setPreview(url)
      onChange(url)
    } catch {
      // 回滚预览
      setPreview(initialUrl)
      onChange(initialUrl)
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className='relative group'
        aria-label='修改头像'>
        <Avatar
          avatarSrc={preview}
          displayName={displayName}
          size={size}
        />
        <div className='absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
          <CameraIcon className='w-7 h-7 text-white' />
        </div>
      </button>
      <span className='text-xs text-muted-foreground'>
        {uploading ? '上传中…' : '点击修改头像'}
      </span>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  )
}
