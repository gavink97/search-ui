"use client"

import HeaderReturn from "@/components/header-return"

export default function Report() {

    return (
       <div className="mt-10 w-full">
            <HeaderReturn/>
            <div className='m-6 text-center'>
                <div className="pb-0 overflow-hidden">
                    <p className="text-2xl"> This feature will be coming soon!</p>
                    <br/>
                     <p className="text-xl">For now email
                     <a href='mailto:gavin@gav.ink'> gavin@gav.ink </a>
                     with a screenshot or description of the issue</p>
                </div>
            </div>
        </div>
    )
}
