'use client';

import { ResultCard, type ResultCardProps } from './result-card';

interface SearchResultListProps {
	results: ResultCardProps[];
}

export function SearchResultList({ results }: SearchResultListProps) {
	return (
		<div id='result-box' className='mb-32 text-center justify-items-center grid-cols-1 lg:mb-0 lg:text-left'>
			{results.map((result: ResultCardProps) => (
				<ResultCard
					key={result.id}
					id={result.id}
					//data_id={result.data_id}
					title={result.title}
					date={result.date}
					location={result.location}
					price={result.price}
					timestamp={result.timestamp}
					url={result.url}
					images={result.images}
					sources={result.sources}
				/>
			))}
		</div>
	);
}
