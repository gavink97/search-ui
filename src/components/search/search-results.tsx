'use client';

import { useEffect, useState } from 'react';
import type { ResultCardProps } from './result-card';
import { SearchResultInput } from './search-result-input';
import { SearchResultList } from './search-result-list';

interface SearchResultProps {
	resultList: ResultCardProps[];
}

// create loading state
export function SearchResult({ resultList }: SearchResultProps) {
	const [searchText, setSearchText] = useState('');
	const [resultCount, setResultCount] = useState(0);
	const [totalResultCount, setTotalResultCount] = useState(0);

	const searchFilter = (resultList: ResultCardProps[], searchText: string) => {
		if (!resultList) {
			return [];
		}

		const formattedSearchText = searchText.toLowerCase().replace(/\s/g, '_');

		return resultList.filter(
			(result: ResultCardProps) =>
				result.title.toLowerCase().includes(searchText.toLowerCase()) ||
				result.location.toLowerCase().includes(searchText.toLowerCase()) ||
				result.sources.some((source: string) => source.toLowerCase().includes(formattedSearchText)),
		);
	};

	const sortedResults = searchFilter(resultList, searchText);

	/*
	sortedResults.sort((a, b) => {
		const timeA = new Date(a.time_added).getTime();
		const timeB = new Date(b.time_added).getTime();
		return timeB - timeA;
	});
	*/

	useEffect(() => {
		if (resultList) {
			setTotalResultCount(resultList.length);
			setResultCount(sortedResults.length);
		}
	}, [resultList, sortedResults]);

	const handleSearch = (text: string) => {
		setSearchText(text);
	};

	return (
		<>
			<SearchResultInput onSearch={handleSearch} resultCount={resultCount} totalResultCount={totalResultCount} />

			<SearchResultList results={sortedResults} />
		</>
	);
}
