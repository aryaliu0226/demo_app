/** @format */

'use client'

import { useActionState, useState } from 'react'
import { loginApi } from '@/lib/actions/auth'

import ErrorIcon from '@/ui/icon/ErrorIcon'

export default function AuthForm() {
  const [state, formAction, pending] = useActionState(loginApi, null)
  const [account, setAccount] = useState('丹丹')
  const [password, setPassword] = useState('123456ldd')

  return (
    <form
      action={formAction}
      className='space-y-4'>
      {/* 账号 */}
      <div className='space-y-1.5'>
        <label
          htmlFor='account'
          className='block text-sm font-medium text-zinc-700'>
          账号
        </label>
        <input
          id='account'
          name='account'
          placeholder='请输入账号'
          value={account}
          onChange={e => setAccount(e.target.value)}
          className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
        />
        {state?.error?.account && (
          <div className='flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
            <ErrorIcon />
            {state.error.account}
          </div>
        )}
      </div>

      {/* 密码 */}
      <div className='space-y-1.5'>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-zinc-700'>
          密码
        </label>
        <input
          id='password'
          name='password'
          type='password'
          placeholder='请输入密码'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10'
        />
        {state?.error?.password && (
          <div className='flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>
            <ErrorIcon />
            {state.error.password}
          </div>
        )}
      </div>

      <button
        disabled={pending}
        className='mt-2 w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60'>
        {pending ? '登录中…' : '登录'}
      </button>
    </form>
  )
}
