import './globals.css'
import { Inter } from 'next/font/google'
import Provider from '@/components/auth/provider'
import Header from '@/components/header'
import Footer from '@/components/footer'

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
          <Header/>
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
          {children}
          </main>
          <Footer />
        </Provider>
      </body>
    </html>
  )
}
