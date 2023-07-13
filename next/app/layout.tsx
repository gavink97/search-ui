import Link from 'next/link'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Record player Search Tool',
  description: 'created by Gavin K',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="flex items-center justify-between p-8"> 
        <div className="z-10 w-full max-w-5xl items-center text-sm lg:flex">
      <Link href="/"><h2 className="text-2xl text-bold">Record Player Search Tool</h2></Link>
      </div>
        </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {children}
      </main>
      </body>
    </html>
  )
}
