/** @format */
import { defaultAvatorImage } from '@/app/_config/global'
import Image from 'next/image'
export default function Avatar({
  size = 24,
  displayName = '头像',
  avatarSrc = defaultAvatorImage,
}: {
  size?: number
  displayName?: string
  avatarSrc?: string
}) {
  return (
    <div className='relative shrink-0'>
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt={displayName}
          width={size}
          height={size}
          unoptimized
          style={{ width: size, height: size }}
          className='rounded-full object-cover ring-2 ring-white/20'
        />
      ) : (
        <div
          style={{ width: size, height: size, fontSize: size * 0.4 }}
          className='rounded-full flex items-center justify-center bg-hover text-foreground'>
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
