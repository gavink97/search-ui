"use client"

import Link from 'next/link'
import SignInButton from '@/components/auth/sign-in-button'
import { usePathname } from 'next/navigation'

const Header = () => {
    const isHomePage = usePathname() === '/'


  return (
    <header className={`flex h-24 flex-col justify-center sticky top-0 ${isHomePage ? 'max-sm:bg-gradient-to-br from-indigo-100/50 via-fuchsia-50/50' : 'bg-white'}`}>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          <li className='text-2xl text-bold text-stone-800'>
            <Link href='/'>Gavin Kondrath</Link>
          </li>

          <li className='mt-0'>
            <SignInButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
