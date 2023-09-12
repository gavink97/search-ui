"use client"

import Link from 'next/link'
import SignInButton from '@/components/auth/sign-in-button'
import { usePathname } from 'next/navigation'

const Header = () => {
    const isHomePage = usePathname() === '/'


  return (
    <header className={`flex h-24 flex-col justify-center sticky top-0 ${isHomePage ? 'bg-transparent' : 'bg-white'}`}>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          <li className='text-2xl text-bold'>
            <Link href='/'>Gavin Kondrath</Link>
          </li>

          <li className='mt-1'>
            <SignInButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
