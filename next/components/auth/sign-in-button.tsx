'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import {
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BookOpenIcon,
  CommandLineIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const SignInButton = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
    {session ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" >{session.user?.name || 'User'}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-55">
          <DropdownMenuItem onClick={() => router.push('/rpst')}>
            <MagnifyingGlassIcon className="h-4 w-4 mr-2" />  Search Tool
            </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
          {/* <DropdownMenuItem onClick={() => router.push('')}>
           <UserIcon className="h-4 w-4 ml-px mr-2" />  Profile
           </DropdownMenuItem>*/}
            <DropdownMenuItem onClick={() => router.push('/privacy')}>
              <ShieldCheckIcon className="h-4 w-4 mr-2" />  Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/tos')}>
              <BookOpenIcon className="h-4 w-4 ml-px mr-1.5" />  Terms of Service
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/report')}>
              <ExclamationCircleIcon className="h-4 w-4 mr-1 text-red-600" /> <p className='ml-0.5 text-red-500'>Report a Problem</p>
            </DropdownMenuItem>
          <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('https://github.com/gavink97')}>
              <CommandLineIcon className="h-4 w-4 ml-px mr-2" />  Github
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('https://www.linkedin.com/in/gavin-kondrath/')}>
              <UserGroupIcon className="h-4 w-4 ml-px mr-2" />  LinkedIn
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('https://gav.ink/')}>
              <GlobeAltIcon className="h-4 w-4 ml-px mr-2" />  Socials
            </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={() => signOut()}>
            <ArrowLeftOnRectangleIcon className="h-4 w-4 ml-px mr-2" /> <p className='font-medium'>Log out</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Bars3Icon className="h-8 w-8 mr-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-55 mr-4">
          <DropdownMenuItem onClick={() => signIn()}>
            <ArrowRightOnRectangleIcon className="h-4 w-4 ml-px mr-2" /> <p className='font-medium'>Sign In</p>
          </DropdownMenuItem>
        <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/privacy')}>
            <ShieldCheckIcon className="h-4 w-4 mr-2" />  Privacy Policy
          </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/tos')}>
            <BookOpenIcon className="h-4 w-4 ml-px mr-1.5" />  Terms of Service
          </DropdownMenuItem>
        <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/report')}>
            <ExclamationCircleIcon className="h-4 w-4 mr-1 text-red-600" /> <p className='ml-0.5 text-red-500'>Report a Problem</p>
          </DropdownMenuItem>
        <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('https://github.com/gavink97')}>
            <CommandLineIcon className="h-4 w-4 ml-px mr-2" />  Github
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('https://www.linkedin.com/in/gavin-kondrath/')}>
            <UserGroupIcon className="h-4 w-4 ml-px mr-2" />  LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('https://gav.ink/')}>
            <GlobeAltIcon className="h-4 w-4 ml-px mr-2" />  Socials
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )}
    </>
  )
}

export default SignInButton
