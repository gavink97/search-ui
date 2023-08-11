'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [data, setData] = useState({
     email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loggingIn = await signIn('credentials', {
      ...data,
      redirect: false,
    });
    if (loggingIn?.error) {
      setError('Incorrect password');
    }
  };

  useEffect(() => {
    if (session?.user) {
      router.push('/');
    }
  }, [session, router]);

  return (
    <section className='flex min-h-full overflow-hidden fixed'>
      <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6 justify-center'>
        <div className='relative mt-12 sm:mt-16'>
          <h1 className='text-center text-2xl font-medium tracking-tight text-slate-700'>
            Sign in to your account
          </h1>
        </div>
        <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-xl shadow-gray-900/10 mix-blend-overlay sm:mx-0 sm:flex-none sm:p-24 rounded-lg'>
        {!session?.user ? (
          <form onSubmit={loginUser}>
            <div className='space-y-2 mb-3 w-60'>
            <Label className='text-slate-700'>Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder='email'
              required
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value })
              } } className={`${undefined} hover:border-2 hover:border-indigo-300`}
                    />
            </div>
            <div className='space-y-2 w-60'>
              <Label className='text-slate-700'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='password'
                required
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value })
                } } className={`${undefined} hover:border-2 hover:border-indigo-300`}
                      />
                      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show the error message */}
            </div>
            <Button
              type='submit'
              variant="outline"
              className='mt-7 w-full text-slate-700'
            >
              Sign in
            </Button>
          </form>
        ) : (
          <p>You are logged in.</p>
        )}
        </div>
      </div>
    </section>
  );
}