import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='flex flex-col justify-center py-2 sticky bottom-0'>
    <div className='container p-0'>
      <ul className='flex items-center justify-between tracking-wider text-stone-500'>
        <li>
          <Link href='/privacy'>Privacy</Link>
        </li>
        <li>
          <Link href='/tos'> Terms of Service</Link>
        </li>
      </ul>
    </div>
  </footer>
  )
}

export default Footer