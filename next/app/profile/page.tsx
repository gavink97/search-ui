'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';

export default function Profile() {
    const { data: session, status } = useSession();
    if (status === "authenticated") {
    return(
        <div>
            <h1>Profile</h1>
            <p>Hello {session?.user.name} </p>
        </div>
    )
}
    return redirect('/signin')
}