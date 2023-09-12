import Header from '@/components/header'
import Footer from '@/components/footer-privacy'
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link';

export default async function Home() {
  return (
    <>
    <div className='min-h-screen flex flex-col'>
      <Header/>
        <div className='flex-1 m-6 text-slate-700 font-medium'>
          <h1 className='text-3xl mb-8'>Welcome to Gavin Kondrath</h1>
          <p className='mb-3 text-justify'>This is my personal website, where I host projects I'm actively developing. Currently, I'm working on the Record Player Search Tool which gathers data from various marketplaces across the Continental United States and displays them in one place for convenience. You can enter the project simply by signing in with your Google account.</p>
          <p className='mb-3 text-justify'>If you find a problem with the app or would like to reach out to me, please email me at <a href='mailto:gavin@gav.ink'>gavin@gav.ink</a></p>
          <p>Thank you,</p>
          <p className='font-semibold'>Gavin K</p>
          <div className='flex justify-center p-16 text-center'>
            <Link className={buttonVariants({ variant: "outline" })} href={'/rpst'}>Enter the Record Player Search Tool</Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
