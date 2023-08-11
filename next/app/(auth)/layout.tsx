import '@/app/globals.css'
import { Inter } from 'next/font/google'
import Provider from '@/components/auth/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Record player Search Tool',
  description: 'created by Gavin K',
}

export default function RootLayout({
children,}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full scroll-smooth antialiased`}
    >
      <body className={inter.className}>
        <Provider session={undefined}>
          <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-br from-indigo-100/50 via-fuchsia-50/50 to-orange-50/50">
          {children}
          </main>
        </Provider>
      </body>
    </html>
  )
}
