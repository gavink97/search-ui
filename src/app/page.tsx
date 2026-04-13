'use client';

import { useState } from 'react';
import { DefaultMetadataProps, DefaultPageProps, type MetadataProps, type PageProps } from '@/components/search/props';
import type { ResultCardProps } from '@/components/search/result-card';
import { SearchBar } from '@/components/search/search-bar';
import { SideBar } from '@/components/search/side-bar';
import { ResultGrid } from '@/components/search/views/result-grid';

export default function Page() {
	const defaultPage = DefaultPageProps();
	const [pageHistory, setPageHistory] = useState<PageProps[]>([
		{
			expire_by: defaultPage.expire_by,
			last_id: defaultPage.last_id,
			last_date: defaultPage.last_date,
			order: defaultPage.order,
			limit: defaultPage.limit,
			query: defaultPage.query,
			locations: defaultPage.locations,
		},
	]);

	const [results, setResults] = useState<ResultCardProps[]>([]);
	const [metadata, setMetadata] = useState<MetadataProps>(DefaultMetadataProps());
	const [isFinalPage, setFinalPage] = useState(true);
	const [isLoading, setLoading] = useState(true);
	const [isInitialized, setInitialized] = useState(false);

	return (
		<div id='ui'>
			<SearchBar
				pageHistory={pageHistory}
				setLoading={setLoading}
				setPageHistory={setPageHistory}
				setResults={setResults}
				setMetadata={setMetadata}
				setFinalPage={setFinalPage}
			/>
			<div id='stat-line'>
				{metadata.total !== undefined && metadata.total !== null ? `displaying ${metadata.total} results` : ''}
			</div>
			<SideBar />
			<ResultGrid
				pageHistory={pageHistory}
				isLoading={isLoading}
				setLoading={setLoading}
				setPageHistory={setPageHistory}
				results={results}
				setResults={setResults}
				setMetadata={setMetadata}
				isFinalPage={isFinalPage}
				setFinalPage={setFinalPage}
				isInitialized={isInitialized}
				setInitialized={setInitialized}
			/>
		</div>
	);
}
