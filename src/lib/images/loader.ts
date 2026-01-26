'use client';

interface ClImage {
	src: string;
	size: string;
}

export default function imageLoader(img: ClImage) {
	return `https://images.craigslist.org/d/${img.src}`;
}
