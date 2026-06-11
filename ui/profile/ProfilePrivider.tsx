/** @format */

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { type Profile } from '@/lib/dal/profile'

type ProfileContextValue = {
  profile: Profile | null
  updateProfile: (partial: Partial<Profile>) => void
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  updateProfile: () => {},
})

export function ProfileProvider({
  profile: initialProfile,
  children,
}: {
  profile: Profile | null
  children: React.ReactNode
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)

  // 路由刷新（revalidatePath）后服务端会推送最新 profile 作为新 prop，在此同步
  useEffect(() => {
    setProfile(initialProfile)
  }, [initialProfile])

  function updateProfile(partial: Partial<Profile>) {
    setProfile(prev => (prev ? { ...prev, ...partial } : prev))
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext).profile
}

export function useUpdateProfile() {
  return useContext(ProfileContext).updateProfile
}
