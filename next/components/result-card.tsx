import Link from 'next/link'
import Image from 'next/image'

interface ResultCardProps {
  name: string;
  price: number;
  source: string;
  timestamp: string;
  location: string;
  post: string;
  image: string;
}

export function ResultCard({ name, price, location, post, image }: ResultCardProps) {
    return (
        <Link
          href={post}
          className="group rounded-lg border border-transparent px-5 py-4 m-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
      >
        <Image src={`/${image}`} alt='' width="200" height="200"></Image>
        <h2 className={`text-base font-semibold`}>
          {name}
        </h2>
        <h2 className={`text-base font-semibold`}>
        {location}
        </h2>
        <h2 className={`text-base font-semibold`}>
        {price}
        </h2>
      </Link>
    )
}