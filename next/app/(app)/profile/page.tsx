'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';

export default function Profile() {
    const { data: session, status } = useSession();
    if (status === "authenticated") {
    return(
        <div className=''>
            <h1 className='text-xl'>Profile</h1>
            <div className=''>
                <pre className=''>{JSON.stringify(session)}</pre>
            </div>
        </div>
    )
}
    return redirect('/signin')
}