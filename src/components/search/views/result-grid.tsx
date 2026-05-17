'use client';

import { type JSX, memo, useCallback, useEffect, useRef, useState } from 'react';
import { type CellComponentProps, Grid } from 'react-window';
import { DefaultPageProps, type MetadataProps, type PageProps } from '@/components/search/props';
import { ResultCard, type ResultCardProps } from '@/components/search/result-card';
import { ConvertREMToPixels } from '@/components/utils';
import { BREAKPOINTS } from '@/globals/global';
import { queryMetadata } from '@/lib/metadata';
import { queryDB } from '@/lib/query';

const BR = BREAKPOINTS;

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

	const [width, setWidth] = useState(0);
	const [columns, setColumns] = useState(1);
	const observer = useRef<IntersectionObserver | null>(null);

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
		if (isInitialized) {
			return;
		}

		init();

		return () => {
			if (observer.current) {
				observer.current.disconnect();
			}
		};
	}, [init, isInitialized]);

	const loadPage = useCallback(
		async (index: number) => {
			if (isLoading || isFinalPage) {
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

				setResults((prev) => [...prev, ...resp.results]);
				setPageHistory((prev) => [...prev, resp.page]);
				setFinalPage(resp.results.length < resp.page.limit);
			} catch (error) {
				// gracefully handle this?
				console.error('Error loading more results:', error);
			} finally {
				setLoading(false);
			}
		},
		[isLoading, isFinalPage, pageHistory, setFinalPage, setPageHistory, setResults, setLoading, defaultPage],
	);

	const lazyLoader = useCallback(
		(node: HTMLDivElement | null) => {
			if (isLoading) {
				return;
			}

			if (observer.current) {
				observer.current.disconnect();
			}

			observer.current = new IntersectionObserver((entries) => {
				if (entries[0]?.isIntersecting && !isFinalPage) {
					loadPage(pageHistory.length - 1);
				}
			});

			if (node) {
				observer.current.observe(node);
			}
		},
		[isLoading, isFinalPage, pageHistory, loadPage],
	);

	const handleWidthChange = useCallback(() => {
		const w = window.innerWidth;
		setWidth(w);
	}, []);

	useEffect(() => {
		handleWidthChange();
		window.addEventListener('resize', handleWidthChange);

		return () => window.removeEventListener('resize', handleWidthChange);
	}, [handleWidthChange]);

	useEffect(() => {
		const rem = ConvertREMToPixels(1);
		let newColumns = 1;

		if (width < BR.MD * rem) {
			newColumns = 1;
		} else if (width >= BR.MD * rem && width < BR.XL * rem) {
			newColumns = 2;
		} else if (width >= BR.XL * rem) {
			newColumns = 3;
		}

		if (newColumns !== columns) {
			setColumns(newColumns);
		}
	}, [width, columns]);

	return (
		<ResultContainer
			results={results}
			isFinalPage={isFinalPage}
			isLoading={isLoading}
			columns={columns}
			width={width}
			lazyLoader={lazyLoader}
		/>
	);
}

interface ResultContainerProps {
	results: ResultCardProps[];
	isFinalPage: boolean;
	isLoading: boolean;
	columns: number;
	width: number;
	lazyLoader: (node: HTMLDivElement | null) => void;
}

function ResultContainer({ results, isFinalPage, isLoading, columns, width, lazyLoader }: ResultContainerProps) {
	const itemHeight = 414;

	const container = (children: JSX.Element) => {
		return <div className='result-container'>{children}</div>;
	};

	if (results.length === 0 && !isLoading) {
		return container(NoResults());
	}

	const ResultMemo = memo(
		({
			id,
			title,
			date,
			location,
			price,
			timestamp,
			url,
			post_date,
			images,
			sources,
			style,
			className,
		}: ResultCardProps) => (
			<ResultCard
				id={id}
				title={title}
				date={date}
				location={location}
				price={price}
				timestamp={timestamp}
				url={url}
				post_date={post_date}
				images={images}
				sources={sources}
				style={style}
				className={className ?? ''}
			/>
		),
	);

	const card = useCallback(
		({ columnIndex, rowIndex, style }: CellComponentProps<{ results: ResultCardProps[] }>) => {
			const result = results[rowIndex * columns + columnIndex];
			if (!result) return null;

			return (
				<div style={{ overflowY: 'hidden', ...style }}>
					<ResultMemo
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
						style={result.style}
					/>
				</div>
			);
		},
		[results, columns],
	);

	return container(
		<div id='result-box' className='justify-items-center'>
			<Grid
				className='result-container'
				cellComponent={card}
				cellProps={{ results: results }}
				columnCount={columns}
				columnWidth={width / columns}
				rowCount={results.length / columns}
				rowHeight={itemHeight}
			/>
			{isLoading && <Loading />}
			{!isFinalPage && <div ref={lazyLoader} className='observer' key='observer-bottom' />}
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
