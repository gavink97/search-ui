import { getServerSession } from "next-auth/next"
import { authOptions } from "@/components/auth/auth.config"
import { redirect } from 'next/navigation';

export default async function Profile() {
    const session = await getServerSession(authOptions)
    if (session) {
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