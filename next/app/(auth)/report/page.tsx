"use client"

import { useRouter } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { HomeIcon } from '@heroicons/react/24/outline'


export default function Report() {
      const router = useRouter();

    return (
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

            <div className="text-lg mb-4 mt-10 text-stone-700 text-center md:text-left md:ml-8">
                <div className="pb-0 overflow-hidden">
                    <p className="text-2xl"> This feature will be coming soon!</p>
                    <br/>
                     <p className="text-xl">For now email
                     <a href='mailto:gavin@gav.ink'> gavin@gav.ink </a>
                     with a screenshot or description of the issue</p>
                </div>
            </div>
        </div>
    )
}
