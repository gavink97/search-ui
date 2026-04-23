'use client';

import { type JSX, useCallback, useEffect, useRef } from 'react';
import { DefaultPageProps, type MetadataProps, type PageProps } from '@/components/search/props';
import { ResultCard, type ResultCardProps } from '@/components/search/result-card';
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
		console.log(results);
	}, [pageHistory]);
	*/

	const loadPage = useCallback(
		async (index: number) => {
			const prevIndex = pageHistory.length - 5;

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
						return [...resp.results, ...prev.slice(0, limit * 2)];
					});

					setPageHistory((prev) => prev.slice(0, -1));
					setFinalPage(false);
				} else {
					setResults((prev) => {
						if (prev.length >= 3 * limit) {
							return [...prev.slice(-1 * (limit * 2)), ...resp.results];
						}
						return [...prev, ...resp.results];
					});

					setPageHistory((prev) => [...prev, resp.page]);
					setFinalPage(resp.results.length < resp.page.limit);
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
					loadPage(pageHistory.length - 5);
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

	return (
		<ResultContainer
			pageHistory={pageHistory}
			results={results}
			isFinalPage={isFinalPage}
			isLoading={isLoading}
			topRef={topRef}
			botRef={botRef}
		/>
	);
}

interface ResultContainerProps {
	pageHistory: PageProps[];
	results: ResultCardProps[];
	isFinalPage: boolean;
	isLoading: boolean;
	topRef: (node: HTMLDivElement | null) => void;
	botRef: (node: HTMLDivElement | null) => void;
}

function ResultContainer({ pageHistory, results, isFinalPage, isLoading, topRef, botRef }: ResultContainerProps) {
	const columns = 6; // use 12 later when using 4 columns

	const container = (children: JSX.Element) => {
		return <div className='result-container'>{children}</div>;
	};

	if (results.length === 0 && !isLoading) {
		return container(NoResults());
	}

	const builtResults = () => {
		const elements = [];

		for (const [index, result] of results.entries()) {
			const card = (
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
			);

			switch (index) {
				case columns:
					if (pageHistory.length > 4) {
						elements.push(<div ref={topRef} className='observer' key='observer-top' />);
					}

					elements.push(card);
					break;
				case results.length - columns:
					if (!isFinalPage) {
						elements.push(<div ref={botRef} className='observer' key='observer-bottom' />);
					}

					elements.push(card);
					break;
				default:
					elements.push(card);
			}
		}

		return elements;
	};

	return container(
		<div id='result-box' className='justify-items-center'>
			{builtResults()}
			{isLoading && <Loading />}
		</div>,
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
