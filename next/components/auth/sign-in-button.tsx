'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"



const SignInButton = () => {
  const { data: session } = useSession();

  return (
    <>
    {session ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" >{session.user?.name || 'User'}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-55">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
            <Link href={'/profile'}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <Link href={'/privacy'}>Privacy Policy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
            <Link href={'/tos'}>Terms of Service</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={() => signOut()}>
            Log out
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