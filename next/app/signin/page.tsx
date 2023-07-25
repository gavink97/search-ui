'use client'

import Button from '@/components/auth/button'
import TextField from '@/components/auth/text-field'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [data, setData] = useState({
     email: '',
    password: ''
  });

const loginUser = async (e) => {
  e.preventDefault();
  signIn('credentials', {
    ...data,
    redirect: true,
  });
};

  return (
    <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='text-center text-2xl font-medium tracking-tight text-gray-900'>
            Sign in to your account
          </h1>
        </div>
        <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24'>
          <form onSubmit={loginUser}>
            <div className='space-y-2 mb-3'>
              <TextField
                id='email'
                name='email'
                type='email'
                label='Email'
                placeholder='email'
                required
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                }}
              />
            </div>
            <div className='space-y-2'>
              <TextField
                id='password'
                name='password'
                type='password'
                label='Password'
                placeholder='password'
                required
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                }}
              />
            </div>
            <Button
              type='submit'
              variant='outline'
              color='gray'
              className='mt-7 w-full'
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}