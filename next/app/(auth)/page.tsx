import Header from '@/components/header'
import Footer from '@/components/footer-privacy'
import { buttonVariants } from "@/components/ui/button"
import Link from 'next/link';

export default async function Home() {
  return (
    <>
    <div className='h-full'>
      <Header/>
        <div className='m-6 text-slate-700 font-medium'>
          <h1 className='text-3xl mb-8'>Welcome to Gavin Kondrath</h1>
          <p className='mb-3'>We are currently hosting the Record Player Search Tool. You can enter the project by signing in and clicking the button. If you don't have an account you can request access by clicking the button and filling out the form below.</p>
          <p>Thank you,</p>
          <p className='font-semibold'>Gavin K</p>
          <div className='flex justify-center p-16'>
            <Link className={buttonVariants({ variant: "outline" })} href={'/rpst'}>Enter the Record Player Search Tool</Link>
          </div>
        </div>

        <div className='m-6 text-slate-700 font-medium'>
          <h1 className='text-3xl mb-8 pt-16'>Request access</h1>
          <p className=''>Request access to the app</p>
          <div className='flex justify-center p-16'>
            <Link className={buttonVariants({ variant: "outline" })} href={'https://forms.gle/tjqrbQh2qBtrmAWp9'}>Request Access</Link>
          </div>
        </div>
        <div className='absolute bottom-2 container'>
        <Footer />
        </div>
      </div>
    </>
  )
}
