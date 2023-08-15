"use client"
import Link from 'next/link'
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

interface ResultCardProps {
  id: number;
  title: string;
  price: string;
  post_timestamp: string;
  location: string;
  post_url: string;
  data_pid: string;
  is_new: boolean;
  cloudinary_link: string | null;
  sources: string;
}

export function ResultCard({ id, title, price, post_timestamp, location, post_url, data_pid, is_new, cloudinary_link, sources }: ResultCardProps) {
  const defaultImage = "/pyapp/images/no_image.png";

    return (
        <Link
          href={post_url}
          className="group rounded-lg border border-transparent px-5 py-4 m-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
      >
      {cloudinary_link ? (
        <CldImage
          src={cloudinary_link}
          alt='record player'
          width="300"
          height="300"
          format="webp"
          sizes="25w"
          crop='fill'
        />
      ) : (
        <Image
          src={defaultImage}
          alt='missing record player photo'
          width="300"
          height="300"
        >
        </Image>
      )}
        <h2 className={`text-base mt-2 font-semibold text-center`}>
          {title}
        </h2>
        <h2 className={`text-base font-semibold text-center`}>
        {location} {post_timestamp}
        </h2>
        <h2 className={`text-base font-semibold text-center`}>
        {price}
        </h2>
      </Link>
    )
}