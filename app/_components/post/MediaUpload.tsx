/** @format */
'use client'

import { useState, useRef } from 'react'
import {
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import { normalizeImage, uploadToOSS } from '@/app/_lib/upload'

type MediaItem = { preview: string; url: string }

/* ── Props ──────────────────────────────────────────────── */
type Props = {
  /** 上传进行时通知父组件，用于禁用提交按钮 */
  onUploadingChange?: (uploading: boolean) => void
}

/* ── 组件 ────────────────────────────────────────────────── */
export default function MediaUpload({ onUploadingChange }: Props) {
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')

  /* ── 类型切换：清空另一方数据 ──────────────────────────── */
  function switchType(type: 'image' | 'video') {
    if (type === mediaType) return
    if (type === 'video') setPictures([])
    else setVideo(null)
    setMediaType(type)
  }

  const [pictures, setPictures] = useState<MediaItem[]>([])
  const [video, setVideo] = useState<MediaItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const picInputRef = useRef<HTMLInputElement>(null)
  const vidInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null, type: 'image' | 'video') {
    if (!files || files.length === 0) return
    setUploading(true)
    onUploadingChange?.(true)
    try {
      if (type === 'image') {
        const added = await Promise.all(
          Array.from(files).map(async f => {
            const normalized = await normalizeImage(f)
            return {
              preview: URL.createObjectURL(normalized),
              url: await uploadToOSS(normalized),
            }
          }),
        )
        setPictures(prev => [...prev, ...added])
      } else {
        const f = files[0]
        const url = await uploadToOSS(f)
        setVideo({ preview: URL.createObjectURL(f), url })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
      const ref = type === 'image' ? picInputRef : vidInputRef
      if (ref.current) ref.current.value = ''
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      {/* ── 类型 tab ────────────────────────────────────── */}
      <div className='flex w-fit gap-1 rounded-xl bg-secondary p-1'>
        <TabButton
          active={mediaType === 'image'}
          onClick={() => switchType('image')}
          icon={<PhotoIcon className='h-4 w-4' />}
          label='图片'
        />
        <TabButton
          active={mediaType === 'video'}
          onClick={() => switchType('video')}
          icon={<VideoCameraIcon className='h-4 w-4' />}
          label='视频'
        />
      </div>

      {/* ── 图片上传区 ───────────────────────────────────── */}
      {mediaType === 'image' && (
        <div className='flex flex-wrap gap-3'>
          {pictures.map((p, i) => (
            <div
              key={p.url}
              className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl'>
              <img
                src={p.preview}
                alt=''
                className='h-full w-full object-cover'
              />
              <button
                type='button'
                onClick={() =>
                  setPictures(prev => prev.filter((_, idx) => idx !== i))
                }
                className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white'>
                <XMarkIcon className='h-3 w-3' />
              </button>
              <input
                type='hidden'
                name='pictures'
                value={p.url}
              />
            </div>
          ))}
          <AddButton
            onClick={() => picInputRef.current?.click()}
            loading={uploading}
            icon={<PhotoIcon className='h-6 w-6' />}
            label='添加图片'
          />
          <input
            ref={picInputRef}
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={e => handleFiles(e.target.files, 'image')}
          />
        </div>
      )}

      {/* ── 视频上传区 ───────────────────────────────────── */}
      {mediaType === 'video' && (
        <div className='flex flex-wrap gap-3'>
          {video ? (
            <div className='relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-black'>
              <video
                src={video.preview}
                className='h-full w-full object-cover'
                muted
              />
              <button
                type='button'
                onClick={() => setVideo(null)}
                className='absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white'>
                <XMarkIcon className='h-3 w-3' />
              </button>
              <input
                type='hidden'
                name='video'
                value={video.url}
              />
            </div>
          ) : (
            <AddButton
              onClick={() => vidInputRef.current?.click()}
              loading={uploading}
              icon={<VideoCameraIcon className='h-6 w-6' />}
              label='添加视频'
            />
          )}
          <input
            ref={vidInputRef}
            type='file'
            accept='video/*'
            className='hidden'
            onChange={e => handleFiles(e.target.files, 'video')}
          />
        </div>
      )}
    </div>
  )
}

/* ── 子组件 ──────────────────────────────────────────────── */
function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm transition ${
        active
          ? 'bg-foreground text-background font-medium'
          : 'text-muted-foreground hover:text-foreground'
      }`}>
      {icon}
      {label}
    </button>
  )
}

function AddButton({
  onClick,
  loading,
  icon,
  label,
}: {
  onClick: () => void
  loading: boolean
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={loading}
      className='flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-muted-foreground transition hover:border-white/40 disabled:opacity-50'>
      {loading ? (
        <span className='text-xs'>上传中…</span>
      ) : (
        <>
          {icon}
          <span className='text-xs'>{label}</span>
        </>
      )}
    </button>
  )
}
