'use client'

import { useSession } from 'next-auth/react'

export default function Profile() {
    const { data: session, status } = useSession();
    console.log(session)
    return(
        <div>
            <h1>Profile</h1>
            <p>Hello {session?.user.name} </p>
        </div>
    )
}