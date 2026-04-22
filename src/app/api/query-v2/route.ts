import sqlite, { type SQLInputValue } from 'node:sqlite';
import { type NextRequest, NextResponse } from 'next/server';
import type { ResponseError } from '@/app/api/utils';
import { DefaultPageProps, type PageProps } from '@/components/search/props';
import type { ResultCardProps } from '@/components/search/result-card';
import { DB_NAME } from '@/globals/global';

export interface QueryResponse {
	page: PageResponse;
	results: ResultCardProps[];
}

interface PageResponse extends PageProps {
	request: PageProps;
}

export async function POST(request: NextRequest): Promise<NextResponse<QueryResponse> | NextResponse<ResponseError>> {
	var id: number;
	var date: string;

	try {
		const db = new sqlite.DatabaseSync(DB_NAME, {
			readOnly: true,
			enableForeignKeyConstraints: true,
		});

		const body: PageProps = await request.json();

		let order = body.order;

		if (order !== 'DESC' && order !== 'ASC') {
			order = 'DESC';
		}

		const defaultProps = DefaultPageProps(order);

		// these params will come from json or something and will be sanitzed first
		let {
			expire_by = defaultProps.expire_by,
			last_id = defaultProps.last_id,
			last_date = defaultProps.last_date,
			limit = defaultProps.limit,
			query = defaultProps.query,
			locations = defaultProps.locations,
		}: PageProps = body;

		if (!Array.isArray(locations)) {
			locations = locations ? [Number(locations)] : [];
		}

		const searchQuery = query ? `%${query}%` : '%%';

		const placeholders = locations.length > 0 ? locations.map(() => '?').join(',') : '?';

		const locationCondition = locations.length > 0 ? `AND (l.id IN (${placeholders}) OR l.id IS NULL)` : '';

		const expireCondition = `AND (i.timestamp > ?)`;

		const q = `
SELECT
    i.id,
    i.title,
    i.date,
    i.location,
    i.price,
    i.timestamp,
    i.url,
	i.post_date,
    GROUP_CONCAT(DISTINCT img.url) AS images,
    GROUP_CONCAT(DISTINCT l.local) AS sources
FROM
    items i
LEFT JOIN
    item_images img ON i.id = img.item_id
LEFT JOIN
    source_items src ON i.id = src.item_id
LEFT JOIN
    locals l ON src.local_id = l.id
WHERE
    (i.post_date, i.id) < (?, ?)
    AND (i.title LIKE ? OR i.location LIKE ?)
	${locationCondition}
	${expireCondition}
GROUP BY
    i.id, i.title, i.date, i.location, i.price, i.timestamp, i.url
ORDER BY
    i.post_date ${order}, i.id ${order}
LIMIT ?;
`;

		let params: SQLInputValue[] = [last_date, last_id, searchQuery, searchQuery];

		if (locations.length > 0) {
			params = [...params, ...locations, expire_by, limit];
		} else {
			params = [...params, expire_by, limit];
		}

		const stmt = db.prepare(q);
		const rows = stmt.all(...params);

		let processedRows: ResultCardProps[] = [];

		processedRows = rows.map((row: Record<string, sqlite.SQLOutputValue>) => {
			const id = Number(row.id) || 0;
			const title = String(row.title || '');
			const date = String(row.date || '');
			const location = String(row.location || '');
			const price = String(row.price || '');
			const timestamp = String(row.timestamp || '');
			const url = String(row.url || '');
			const postDate = String(row.post_date || '');

			const imagesRaw = row.images;
			let images: string[] = [];
			if (typeof imagesRaw === 'string' && imagesRaw.trim() !== '') {
				images = imagesRaw
					.split(',')
					.map((img) => img.trim())
					.filter((img) => img !== '');
				//.map((img) => img.replace('https://images.craigslist.org/d/', ''));
			}

			const sourcesRaw = row.sources;
			let sources: string[] = [];
			if (typeof sourcesRaw === 'string' && sourcesRaw.trim() !== '') {
				sources = sourcesRaw
					.split(',')
					.map((src) => src.trim())
					.filter((src) => src !== '');
			}

			return {
				key: id,
				id: id,
				title: title,
				date: date,
				location: location,
				price: price,
				timestamp: timestamp,
				url: url,
				post_date: postDate,
				images: images,
				sources: sources,
			};
		});

		db.close();

		const last = processedRows[processedRows.length - 1];
		if (last) {
			id = last.id;
			date = last.post_date;
		} else {
			id = last_id;
			date = last_date;
		}

		const page: PageResponse = {
			expire_by: expire_by,
			last_id: id,
			last_date: date,
			order: order,
			limit: limit,
			locations: locations,
			query: query,
			request: {
				expire_by: expire_by,
				last_id: last_id,
				last_date: last_date,
				order: order,
				limit: limit,
				locations: locations,
				query: query,
			},
		};

		return NextResponse.json<QueryResponse>(
			{
				page: page,
				results: processedRows,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
