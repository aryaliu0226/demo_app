/** @format */

'use client'

import { useState } from 'react'
import { useProfile, useUpdateProfile } from './ProfilePrivider'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import EditProfile from './EditProfile'
import type { Profile as ProfileType } from '@/app/_lib/dal/profile'
import Avatar from '../Avatar'

export default function Profile() {
  const profile = useProfile()
  const updateProfile = useUpdateProfile()
  const [editOpen, setEditOpen] = useState(false)

  if (!profile) return null

  const displayName = profile.nickname ?? profile.name ?? profile.account

  function handleSuccess(updated: Partial<ProfileType>) {
    updateProfile(updated)
  }

  return (
    <>
      <section className='w-full flex items-center gap-5 mt-6 mb-6'>
        <Avatar
          avatarSrc={profile?.avatar || ''}
          displayName={profile?.nickname || '图'}
          size={100}></Avatar>

        {/* 信息区 */}
        <div className='flex flex-col gap-2'>
          {/* 昵称 + 编辑按钮 */}
          <div className='flex items-center gap-2'>
            <p className='text-xl text-foreground'>{displayName}</p>
            <button
              type='button'
              onClick={() => setEditOpen(true)}
              className='rounded-full p-0.5 hover:bg-hover transition'
              aria-label='编辑资料'>
              <PencilSquareIcon className='w-4 h-4' />
            </button>
          </div>

          {/* 数据栏 */}
          <div className='flex items-center gap-6 text-muted-foreground'>
            <span>
              关注{' '}
              <strong className='text-foreground font-medium'>
                {profile.followingCount}
              </strong>
            </span>
            <span className='text-muted-foreground/40'>|</span>
            <span>
              粉丝{' '}
              <strong className='text-foreground font-medium'>
                {profile.followerCount}
              </strong>
            </span>
            <span className='text-muted-foreground/40'>|</span>
            <span>
              获赞{' '}
              <strong className='text-foreground font-medium'>
                {profile.stars}
              </strong>
            </span>
          </div>

          {/* 账号 & 简介 */}
          <div className='flex items-center gap-3 text-sm'>
            {profile.account && <span>账号：{profile.account.trim()}</span>}
            <br />

            {profile.brief && <span>简介：{profile.brief}</span>}
          </div>
        </div>
      </section>

      {editOpen && (
        <EditProfile
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
