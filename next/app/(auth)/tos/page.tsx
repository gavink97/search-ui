
import Link from "next/link"
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid'

export default function Tos() {
    return(
      <div className="mt-6">
        <header >
          <Link href='/'>
          <ArrowUturnLeftIcon className="h-6 w-6" />
          </Link>
        </header>
        <div className="m-6">
            <h1 className="text-3xl font-medium mb-12">Terms of Service</h1>
            <div className="m-6">
            <p className="mb-6 text-xl">We do not track or collect user data.</p>
            <div className="text-l">
              If you have questions or concerns regarding our privacy policy please reach out to
                <a href='mailto:gavin@gav.ink'
                > gavin@gav.ink </a>
              and I will get a hold of you as soon as possible.

              <p className="mt-3">Thank you</p>
            </div>
            </div>
        </div>
      </div>
    )
}