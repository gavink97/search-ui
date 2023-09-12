"use client"
import { useRouter } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { HomeIcon } from '@heroicons/react/24/outline'

export default function Privacy() {
  const router = useRouter();

    return(
      <div className="mt-10 ml-12 mr-12">
        <header className="flex flex-col justify-start sticky" >
          <div className='container p-0'>
             <ul className='flex items-center justify-between '>
                <li>
                  <button onClick={() => router.back()}>
                  <ArrowUturnLeftIcon className="h-6 w-6" />
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/')}>
                  <HomeIcon className='h-6 w-6' />
                  </button>
                </li>
              </ul>
           </div>
        </header>

        <div className="m-6">
            <h1 className="text-3xl font-medium mb-12 mt-12 text-center md:text-left md:ml-8">Privacy Policy</h1>
            <div className="m-6">
            <p className="mb-6 text-xl">We do not track or collect any user data.</p>
            <div className="text-xl">
              <p className=''>If you have any questions or concerns, please reach out to me at
                <a href='mailto:gavin@gav.ink'
                > gavin@gav.ink </a>
              and I will get a hold of you as soon as possible.</p>
              <p className="mt-3">Thank you</p>
            </div>
            </div>
        </div>
      </div>
    )
}
