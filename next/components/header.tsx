import Link from 'next/link'
import SignInButton from '@/components/auth/sign-in-button'

const Header = () => {
  return (
    <header className='flex h-24 flex-col justify-center'>
      <nav className='container'>
        <ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
          <li className='text-2xl text-bold'>
            <Link href='/'>Record Player Search Tool</Link>
          </li>
          
          <li className=''>
            <SignInButton />
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header