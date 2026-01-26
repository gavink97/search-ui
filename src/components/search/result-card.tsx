'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';

dayjs.extend(timezone);
dayjs.extend(utc);

export interface ResultCardProps {
	key: number;
	id: number;
	//data_id: number;
	title: string;
	date: string;
	location: string;
	price: string;
	timestamp: string; // timestamp
	url: string;
	images: string[];
	sources: string[];
}

function _formatTimestamp(
	timestamp: string,
	targetTimezone: string = 'US/Central', // use TZ
): string {
	const now = dayjs();

	const parsedTimestamp = dayjs.tz(timestamp, targetTimezone);

	const minutesDifference = now.diff(parsedTimestamp, 'minute');
	const hoursDifference = now.diff(parsedTimestamp, 'hour');

	if (minutesDifference < 60) {
		if (minutesDifference <= 1) {
			return '1 min ago';
		}
		return `${minutesDifference} mins ago`;
	} else if (hoursDifference < 24) {
		if (hoursDifference <= 1) {
			return '1 hour ago';
		}
		return `${hoursDifference} hours ago`;
	} else {
		return parsedTimestamp.format('MM/DD');
	}
}

export function ResultCard({
	id,
	//data_id,
	title,
	date,
	location,
	price,
	//timestamp,
	url,
	images,
	//sources,
}: ResultCardProps) {
	const defaultImage = '/no_image.png';
	//const formattedTime = formatTimestamp(timestamp);
	const titleCharacterLimit = 35;
	const priceCharacterLimit = 15;
	const locationCharLimit = 20;

	title = title.replace(/[^\w\s]/gi, '');
	const truncatedTitle = title.length > titleCharacterLimit ? `${title.slice(0, titleCharacterLimit)}...` : title;

	let truncatedPrice = '';
	if (price) {
		truncatedPrice = price.length > priceCharacterLimit ? `${price.slice(0, priceCharacterLimit)}...` : price;
	}

	location = location.replace(/[^\w\s]/gi, '');
	let truncatedLocation = location || '';
	if (location && location.length > locationCharLimit) {
		truncatedLocation = `${location.slice(0, locationCharLimit)}...`;
	}

	return (
		<a
			href={url}
			className='group rounded-lg border border-transparent px-5 py-4 m-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
			target='_blank'
			rel='noopener noreferrer'
		>
			{images.length > 1 ? (
				<div className='slideshow-wrapper'>
					<div className='slideshow'>
						{images.map((img) => (
							<Image
								className='slide'
								src={img}
								alt='source'
								width='300'
								height='300'
								loading='lazy'
								key={`${id}-${img}`}
							/>
						))}
					</div>
				</div>
			) : images.length === 1 ? (
				<Image
					className='standalone'
					src={images[0] ?? ''}
					alt='source'
					width='300'
					height='300'
					loading='lazy'
				/>
			) : (
				<Image
					className='standalone'
					src={defaultImage}
					alt='default'
					width='300'
					height='300'
					loading='lazy'
				/>
			)}

			<h2 className={`text-base mt-2 font-semibold text-center`}>{truncatedTitle}</h2>
			<h2 className={`text-base font-semibold text-center`}>
				{truncatedLocation} {date ?? ''}
			</h2>
			<h2 className={`text-base font-semibold text-center`}>{truncatedPrice}</h2>
		</a>
	);
}
