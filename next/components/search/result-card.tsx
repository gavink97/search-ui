"use client"
import Link from 'next/link'
import { CldImage } from 'next-cloudinary';
import Image from 'next/image';

interface ResultCardProps {
  id: number;
  time_added: string;
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

function formatTimestamp(timestamp: string): string {
  const now = new Date();

  const [datePart, timePart] = timestamp.split(' ');

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  const parsedTimestamp = new Date(year, month - 1, day, hour, minute);

  const timeDifference = now.getTime() - parsedTimestamp.getTime();
  const minutesDifference = Math.floor(timeDifference / (60 * 1000));
  const hoursDifference = Math.floor(minutesDifference / 60);

  if (minutesDifference < 60) {
    if (minutesDifference <= 1) {
      return "1 min ago";
    }
    return `${minutesDifference} mins ago`;
  } else if (hoursDifference < 24) {
    if (hoursDifference <= 1) {
      return "1 hour ago";
    }
    return `${hoursDifference} hours ago`;
  } else {
    const formattedMonth = (month < 10 ? '0' : '') + month;
    const formattedDay = (day < 10 ? '0' : '') + day;
    return `${formattedMonth}/${formattedDay}`;
  }
}

export function ResultCard({ id, time_added, title, price, post_timestamp, location, post_url, data_pid, is_new, cloudinary_link, sources }: ResultCardProps) {
  const defaultImage = "/pyapp/images/no_image.png";
  const formattedTime = formatTimestamp(time_added);

    return (
        <Link
          href={post_url}
          className="group rounded-lg border border-transparent px-5 py-4 m-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
      >
      {cloudinary_link ? (
        <CldImage
          className={`inline`}
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
          className={`inline`}
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
        {location} {formattedTime}
        </h2>
        <h2 className={`text-base font-semibold text-center`}>
        {price}
        </h2>
      </Link>
    )
}
