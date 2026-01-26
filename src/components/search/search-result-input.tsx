'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SearchResultInputProps {
	onSearch: (searchText: string) => void;
	resultCount: number;
	totalResultCount: number;
}

export function SearchResultInput({ onSearch, resultCount, totalResultCount }: SearchResultInputProps) {
	const [searchText, setSearchText] = useState('');

	return (
		<div className='grid w-full max-w-full m-0 items-center justify-center justify-items-center sticky top-24 bg-white lg:top-20'>
			<Label htmlFor='searchResultId'></Label>
			<Input
				className='w-80 text-base'
				type='text'
				value={searchText}
				autoComplete='off'
				id='searchResultId'
				placeholder='Search for a brand or location'
				onChange={(e) => {
					const text = e.target.value;
					setSearchText(text);
					onSearch(text);
				}}
			/>
			<div className='relative bottom-[1.85rem] left-36 pr-4 pointer-events-none'>
				<Search />
			</div>
			<div className='text-center font-medium text-lg md:text-xl container bg-transparent'>
				<ul className='flex items-center justify-center lg:justify-between'>
					<li></li>
					<li className='text-slate-700 relative w-full bottom-3 lg:bottom-2.5 bg-white'>
						{resultCount === 1 ? (
							<p>1 Result</p>
						) : (
							<p>
								Displaying {resultCount} of {totalResultCount} results
							</p>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
}
