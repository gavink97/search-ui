import Link from 'next/link'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className='flex flex-col justify-center py-1 z-10 sticky bottom-0 md:bg-white max-md:invisible'>
      <div className='container'>
        <ul className='flex items-center justify-between tracking-wider text-stone-500'>
          <li className=''>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link" className='text-base px-0'>Made by Gavin Kondrath</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-60 ml-5">
                <div className="flex justify-between">
                  <Avatar>
                    <AvatarImage src="https://res.cloudinary.com/dfun3kr6v/image/upload/v1693057583/gavin-photo.jpg" />
                    <AvatarFallback>GK</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Gavin Kondrath</h4>
                    <p className="text-sm  font-medium">
                      Political Activist 🌏<br></br>
                      Bule Depok @
                      <Link
                        className='text-blue-500'
                        href='https://gav.ink'
                        target="_blank"
                        rel="noopener noreferrer"
                        >gavink
                      </Link>
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </li>
          <li className=''>
            <Link
              className='text-red-500 font-medium text-base'
              href='/report'
              >
              Report a problem
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
