'use client';

import { useState } from 'react';
import { DefaultPageProps, type MetadataProps, type PageProps } from '@/components/search/props';
import type { ResultCardProps } from '@/components/search/result-card';
import { queryMetadata } from '@/lib/metadata';
import { queryDB } from '@/lib/query';

interface SearchBarProps {
	pageHistory: PageProps[];
	setFinalPage: React.Dispatch<React.SetStateAction<boolean>>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setPageHistory: React.Dispatch<React.SetStateAction<PageProps[]>>;
	setResults: React.Dispatch<React.SetStateAction<ResultCardProps[]>>;
	setMetadata: React.Dispatch<React.SetStateAction<MetadataProps>>;
}

export function SearchBar({
	pageHistory,
	setPageHistory,
	setResults,
	setMetadata,
	setFinalPage,
	setLoading,
}: SearchBarProps) {
	const [placeholder, setPlaceholder] = useState('search');
	const defaultPage = DefaultPageProps();

	const search = async (formData: FormData) => {
		try {
			setLoading(true);

			const query = formData.get('query')?.toString() ?? '';
			setResults([]);

			const pageProps = pageHistory.at(-1) ?? defaultPage;

			const search: PageProps = {
				...pageProps,
				query: query,
				last_id: defaultPage.last_id,
				last_date: defaultPage.last_date,
				event_type: 'submit',
			};

			const page = await queryDB(search);
			if (Array.isArray(page)) {
				return;
			}

			setResults(page.results);
			setPageHistory([search, page.page]);
			setFinalPage(page.results.length < page.page.limit);

			const meta = await queryMetadata(search);
			if (Array.isArray(meta)) {
				return;
			}

			setMetadata(meta.metadata);

			if (query === '') {
				setPlaceholder('search');
			} else {
				setPlaceholder(query);
			}

			window.scrollTo(0, 0);
		} catch (error) {
			console.error('Error loading results:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div id='search-bar'>
			<form action={search}>
				<input name='query' placeholder={placeholder} className='text-lg border-zinc-700' />
				<button type='submit'></button>
			</form>
		</div>
	);
}
