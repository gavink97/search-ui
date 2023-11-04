"use client"

import HeaderReturn from "@/components/header-return"

export default function Privacy() {

    return(
      <div className="mt-10 w-full">
        <HeaderReturn/> 
        <div className="m-6">
            <h1 className="text-3xl font-medium mb-12 mt-12 text-center md:text-left md:ml-8">Privacy Policy</h1>
            <div className="m-6">
            <p className="mb-6 text-xl">We do not track or collect any user data.</p>
            <div className="text-xl">
              <p className=''>If you have any questions or concerns, please reach out to me at
                <a href='mailto:gavin@gav.ink'
                > gavin@gav.ink </a>
              and I will get a hold of you as soon as possible.</p>
              <p className="mt-3">Thank you</p>
            </div>
            </div>
        </div>
      </div>
    )
}
