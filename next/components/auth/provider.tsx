"use client"

import { SessionProvider } from "next-auth/react"

interface AuthProps {
    session: any;
    children: React.ReactNode;
}

const Provider = ({ session, children }: AuthProps) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Provider