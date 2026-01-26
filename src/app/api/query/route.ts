import sqlite from 'node:sqlite';
import { NextResponse } from 'next/server';
import type { ResultCardProps } from '@/components/search/result-card';
import { DB_NAME } from '@/globals/global';

// parameters
// query string ""
// location int[] s.id
// page int (total_results / 200)

export async function GET() {
	try {
		const db = new sqlite.DatabaseSync(DB_NAME, {
			readOnly: true,
			enableForeignKeyConstraints: true,
		});

		/*
		const query = `
    SELECT
    i.id,
    i.data_id,
    i.title,
    i.date,
    i.location,
    i.price,
    i.timestamp,
    i.url,
    GROUP_CONCAT(DISTINCT img.url) AS images,
    GROUP_CONCAT(DISTINCT s.source) AS sources
    FROM
    items i
    LEFT JOIN
    item_images img ON i.id = img.item_id
    LEFT JOIN
    source_items src ON i.id = src.item_id
    LEFT JOIN
    sources s ON src.source_id = s.id
    GROUP BY
    i.id, i.data_id, i.title, i.date, i.location, i.price, i.timestamp, i.url
	LIMIT 200;
    `;
	*/

		const query = `
	SELECT
	i.id,
	i.title,
	i.date,
	i.location,
	i.price,
    i.timestamp,
	i.url,
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
	GROUP BY
	i.id, i.title, i.date, i.location, i.price, i.timestamp, i.url;
	`;

		// send total metadata not limited separately

		const stmt = db.prepare(query);
		const rows = stmt.all();

		const processedRows: ResultCardProps[] = rows.map((row: Record<string, sqlite.SQLOutputValue>) => {
			const id = Number(row.id) || 0;
			const title = String(row.title || '');
			const date = String(row.date || '');
			const location = String(row.location || '');
			const price = String(row.price || '');
			const timestamp = String(row.timestamp || '');
			const url = String(row.url || '');

			const imagesRaw = row.images;
			let images: string[] = [];
			if (typeof imagesRaw === 'string' && imagesRaw.trim() !== '') {
				images = imagesRaw
					.split(',')
					.map((img) => img.trim())
					.filter((img) => img !== '')
					.map((img) => img.replace('https://images.craigslist.org/d/', ''));
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
				images: images,
				sources: sources,
			};
		});

		db.close();

		return NextResponse.json({ results: processedRows }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
