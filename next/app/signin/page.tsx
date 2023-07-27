'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [data, setData] = useState({
     email: '',
    password: ''
  });

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn('credentials', {
      ...data,
      redirect: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  //  router.push('/');
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
            <input
              id="email"
              name="email"
              type="email"
              placeholder='email'
              required
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value })
              } } className={undefined}
                    />
            </div>
            <div className='space-y-2'>
              <input
                id='password'
                name='password'
                type='password'
                placeholder='password'
                required
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value })
                } } className={undefined}
                      />
            </div>
            <button
              type='submit'
              color='gray'
              className='mt-7 w-full'
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}