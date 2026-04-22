'use client';

import Image from 'next/image';

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
	post_date: string; //timestamp
	images: string[];
	sources: string[];
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
	const defaultImage = 'no_image.png';
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
			className='result-card group border transition-colors hover:border-gray-500 hover:bg-gray-200 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
			target='_blank'
			rel='noopener noreferrer'
		>
			{images.length > 1 ? (
				<div className='slideshow-wrapper'>
					<div className='slideshow'>
						{images.map((img) => (
							<img
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
				<img
					className='standalone'
					src={images[0] ?? ''}
					alt='source'
					width='300'
					height='300'
					loading='lazy'
				/>
			) : (
				<img
					className='standalone'
					//overrideSrc={defaultImage}
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
