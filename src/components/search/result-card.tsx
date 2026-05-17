'use client';

import { useState } from 'react';

export interface ResultCardProps {
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
	style?: React.CSSProperties | undefined;
	className?: string;
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
	style,
	className,
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

	const [isLoading, setIsLoading] = useState(true);

	const baseClasses =
		'result-card group border transition-colors hover:border-gray-500 hover:bg-gray-200 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30';

	// biome-ignore-start lint/performance/noImgElement: not opting to use Next/Image due to dynamic cdns
	const Gallery = () => {
		if (images.length < 2) {
			return (
				<img
					className='standalone'
					src={images[0] ?? defaultImage}
					alt=''
					width='300'
					height='300'
					loading='lazy'
					onLoad={() => setIsLoading(false)}
					style={{
						opacity: isLoading ? 0 : 1,
						transition: 'opacity 0.2s ease-in-out',
					}}
				/>
			);
		}

		return (
			<div className='slideshow-wrapper'>
				<div className='slideshow'>
					{images.map((img) => (
						<img
							className='slide'
							src={img}
							alt=''
							width='300'
							height='300'
							loading='lazy'
							key={`${id}-${img}`}
							onLoad={() => setIsLoading(false)}
							style={{
								opacity: isLoading ? 0 : 1,
								transition: 'opacity 0.2s ease-in-out',
							}}
						/>
					))}
				</div>
			</div>
		);
	};
	// biome-ignore-end lint/performance/noImgElement: not opting to use Next/Image due to dynamic cdns

	return (
		<a
			href={url}
			className={`${baseClasses} ${className || ''}`}
			target='_blank'
			rel='noopener noreferrer'
			style={style}
		>
			<Gallery />
			<h2 className={`text-base mt-2 font-semibold text-center`}>{truncatedTitle}</h2>
			<h2 className={`text-base font-semibold text-center`}>
				{truncatedLocation} {date ?? ''}
			</h2>
			<h2 className={`text-base font-semibold text-center`}>{truncatedPrice}</h2>
		</a>
	);
}

// make image loading animation
