"use client"

import { useRouter } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'
import { HomeIcon } from '@heroicons/react/24/outline'

const HeaderReturn = () => {
      const router = useRouter();

return(
<header className="flex flex-col justify-start sticky ml-12 mr-12" >
          <div className='container p-0 m-0'>
             <ul className='flex items-center justify-between'>
                <li>
                  <button onClick={() => router.back()}>
                  <ArrowUturnLeftIcon className="h-6 w-6" />
                  </button>
                </li>
                <li className='mr-0'>
                  <button onClick={() => router.push('/')}>
                  <HomeIcon className='h-6 w-6' />
                  </button>
                </li>
              </ul>
           </div>
        </header>
        )
}

export default HeaderReturn
