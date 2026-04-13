'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DefaultPageProps, type MetadataProps, type PageProps } from '@/components/search/props';
import { ResultCard, type ResultCardProps } from '@/components/search/result-card';
import { ConvertREMToPixels } from '@/components/utils';
import { queryMetadata } from '@/lib/metadata';
import { queryDB } from '@/lib/query';

interface ResultGridProps {
	pageHistory: PageProps[];
	results: ResultCardProps[];
	isFinalPage: boolean;
	isLoading: boolean;
	isInitialized: boolean;
	setFinalPage: React.Dispatch<React.SetStateAction<boolean>>;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	setInitialized: React.Dispatch<React.SetStateAction<boolean>>;
	setPageHistory: React.Dispatch<React.SetStateAction<PageProps[]>>;
	setResults: React.Dispatch<React.SetStateAction<ResultCardProps[]>>;
	setMetadata: React.Dispatch<React.SetStateAction<MetadataProps>>;
}

export function ResultGrid({
	pageHistory,
	setPageHistory,
	results,
	setResults,
	setMetadata,
	isFinalPage,
	setFinalPage,
	isLoading,
	setLoading,
	isInitialized,
	setInitialized,
}: ResultGridProps) {
	const defaultPage = DefaultPageProps();

	const topObserver = useRef<IntersectionObserver | null>(null);
	const botObserver = useRef<IntersectionObserver | null>(null);
	const [isObserved, setObserved] = useState(false);

	const init = useCallback(async () => {
		setInitialized(true);

		try {
			setLoading(true);

			const page = await queryDB(pageHistory[0]);
			if (Array.isArray(page)) {
				return;
			}

			setResults(page.results);
			setPageHistory((prev) => [...prev, page.page]);
			setFinalPage(page.results.length < page.page.limit);

			const meta = await queryMetadata(pageHistory.at(-1));
			if (Array.isArray(meta)) {
				return;
			}

			setMetadata(meta.metadata);
		} catch (error) {
			console.error('Error loading results:', error);
		} finally {
			setLoading(false);
		}
	}, [setInitialized, setLoading, setResults, setPageHistory, setFinalPage, setMetadata, pageHistory]);

	useEffect(() => {
		if (isInitialized) return;
		init();

		return () => {
			if (topObserver.current) {
				topObserver.current.disconnect();
			}
			if (botObserver.current) {
				botObserver.current.disconnect();
			}
		};
	}, [init, isInitialized]);

	/*
	useEffect(() => {
		console.log(pageHistory);
	}, [pageHistory]);
	*/

	const loadPage = useCallback(
		async (index: number) => {
			const prevIndex = pageHistory.length - 4;

			if (
				(index === prevIndex && (isLoading || pageHistory.length <= 1)) ||
				(index !== prevIndex && (isLoading || isFinalPage))
			) {
				return;
			}

			try {
				setLoading(true);

				const resp = await queryDB(pageHistory[index]);
				if (Array.isArray(resp)) {
					return;
				}

				let limit = pageHistory[index]?.limit;
				if (!limit) {
					limit = defaultPage.limit;
				}

				if (index === prevIndex) {
					setResults((prev) => {
						return [...resp.results, ...prev.slice(0, limit)];
					});

					setPageHistory((prev) => prev.slice(0, -1));
					setFinalPage(false);
					setObserved(true);
				} else {
					setResults((prev) => {
						if (prev.length >= 2 * limit) {
							return [...prev.slice(-1 * limit), ...resp.results];
						}
						return [...prev, ...resp.results];
					});

					setPageHistory((prev) => [...prev, resp.page]);
					setFinalPage(resp.results.length < resp.page.limit);
					setObserved(true);
				}
			} catch (error) {
				console.error('Error loading more results:', error);
			} finally {
				setLoading(false);
			}
		},
		[isLoading, isFinalPage, pageHistory, setFinalPage, setPageHistory, setResults, setLoading, defaultPage],
	);

	const topRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) return;
			if (topObserver.current) topObserver.current.disconnect();

			topObserver.current = new IntersectionObserver((entries) => {
				if (entries[0]?.isIntersecting) {
					loadPage(pageHistory.length - 4);
				}
			});

			if (node) topObserver.current.observe(node);
		},
		[isLoading, pageHistory, loadPage],
	);

	const botRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) return;
			if (botObserver.current) botObserver.current.disconnect();

			botObserver.current = new IntersectionObserver((entries) => {
				if (entries[0]?.isIntersecting && !isFinalPage) {
					loadPage(pageHistory.length - 1);
				}
			});

			if (node) botObserver.current.observe(node);
		},
		[isLoading, isFinalPage, pageHistory, loadPage],
	);

	useLayoutEffect(() => {
		if (!isObserved) return;

		const width = window.innerWidth;
		const rem = ConvertREMToPixels(1);

		let columns: number;

		if (width < rem * 48) {
			columns = 1;
		} else if (width >= rem * 48 && width < rem * 80) {
			columns = 2;
		} else {
			columns = 3;
		}

		const offset = (83 / columns) * 414;
		window.scroll({ top: offset, behavior: 'instant' });
		setObserved(false);
	}, [isObserved]);

	return (
		<div className='result-container'>
			{pageHistory.length > 3 && <div ref={topRef} className='observer' />}

			<div id='result-box' className='justify-items-center'>
				{results.length > 0
					? results.map((result: ResultCardProps) => (
							<ResultCard
								key={result.id}
								id={result.id}
								title={result.title}
								date={result.date}
								location={result.location}
								price={result.price}
								timestamp={result.timestamp}
								url={result.url}
								post_date={result.post_date}
								images={result.images}
								sources={result.sources}
							/>
						))
					: !isLoading && <NoResults />}

				{isLoading && <Loading />}
			</div>
			{!isFinalPage && <div ref={botRef} className='observer' />}
		</div>
	);
}

function NoResults() {
	return <p>No results found</p>;
}

function Loading() {
	return (
		<div className='py-4'>
			<p>Loading...</p>
		</div>
	);
}
