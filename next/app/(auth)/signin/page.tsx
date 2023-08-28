'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import Footer from '@/components/footer-privacy'
import { HomeIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession();

  useEffect(() => {
    console.log('session:', session); // Log session data
    console.log('router:', router); // Log router object

    if (session?.user) {
      console.log('Redirecting to /rpst'); // Log redirect
      router.push('/rpst');
    }
  }, [session, router]);

  return (
    <>
      <section className='flex min-h-full overflow-hidden pt-16 sm:py-28'>
        <div className='absolute top-6 left-8'>
          <button onClick={() => router.push('/')}>
            <HomeIcon className="h-6 w-6" />
          </button>
        </div>
        <div className='mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6'>
          <div className='relative mt-12 sm:mt-16'>
            <h1 className='text-center text-2xl font-medium tracking-tight text-gray-900'>
            Sign in to your account
            </h1>
          </div>
          <div className='sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24'>
            {!session?.user ? (
              <div className='justify'>
                <p className='mb-6 font-semibold'>Please sign in using your Google Account</p>
                <GoogleSignInButton />
              </div>
            ) : (
              <p>You are logged in.</p>
            )}
          </div>
        </div>
      </section>
      <div className='absolute bottom-2 container'>
        <Footer/>
      </div>
    </>
  );
}