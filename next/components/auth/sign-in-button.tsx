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
  UserIcon,
  MagnifyingGlassIcon,
  ArrowLeftOnRectangleIcon,
  ExclamationCircleIcon
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
            <p className='ml-px'>  Privacy Policy</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/tos')}>
            <p className='ml-px'>Terms of Service</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/report')}>
              <ExclamationCircleIcon className="h-4 w-4 mr-1 text-red-600" /> <p className='ml-0.5 text-red-500'>Report a Problem</p>
            </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={() => signOut()}>
            <ArrowLeftOnRectangleIcon className="h-4 w-4 ml-px mr-2" /> <p className='font-medium'>Log out</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button variant="outline" onClick={() => signIn()}>Sign In</Button>
    )}
    </>
  )
}

export default SignInButton
