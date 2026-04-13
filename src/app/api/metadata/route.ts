import sqlite, { type SQLOutputValue } from 'node:sqlite';
import { type NextRequest, NextResponse } from 'next/server';
import type { ResponseError } from '@/app/api/utils';
import {
	type DataCountryProps,
	type DataLocalProps,
	type DataSourceProps,
	type DataTerritoryProps,
	DefaultPageProps,
	type MetadataProps,
} from '@/components/search/props';
import { DB_NAME } from '@/globals/global';

export interface MetadataResponse {
	metadata: MetadataProps;
}

export async function POST(
	request: NextRequest,
): Promise<NextResponse<MetadataResponse> | NextResponse<ResponseError>> {
	const defaultProps = DefaultPageProps();
	try {
		const db = new sqlite.DatabaseSync(DB_NAME, {
			readOnly: true,
			enableForeignKeyConstraints: true,
		});

		const body = await request.json();

		const { expire_by = defaultProps.expire_by, query = defaultProps.query } = body;

		const searchQuery = query ? `%${query}%` : '%%';

		const countsQuery = `
WITH filtered_items AS (
    SELECT DISTINCT i.id
    FROM items i
	WHERE (i.title LIKE ? OR i.location LIKE ?)
	AND (i.timestamp > ?)
),
item_locations AS (
    SELECT DISTINCT
        si.source_id,
        l.country_id,
        l.territory_id,
        l.id AS local_id
    FROM source_items si
    JOIN locals l ON si.local_id = l.id
    WHERE si.item_id IN (SELECT id FROM filtered_items)
),
local_counts AS (
    SELECT
        si.source_id,
        l.country_id,
        l.territory_id,
        l.id AS local_id,
        l.local AS local_name,
        COUNT(DISTINCT si.item_id) AS local_count
    FROM source_items si
    JOIN locals l ON si.local_id = l.id
    WHERE si.item_id IN (SELECT id FROM filtered_items)
    GROUP BY si.source_id, l.country_id, l.territory_id, l.id, l.local
),
territory_counts AS (
    SELECT
        source_id,
        country_id,
        territory_id,
        SUM(local_count) AS territory_count
    FROM local_counts
    GROUP BY source_id, country_id, territory_id
),
country_counts AS (
    SELECT
        source_id,
        country_id,
        SUM(territory_count) AS country_count
    FROM territory_counts
    GROUP BY source_id, country_id
),
source_counts AS (
    SELECT
        source_id,
        SUM(country_count) AS source_count
    FROM country_counts
    GROUP BY source_id
)
SELECT
    s.id AS source_id,
    s.name AS source_name,
	sc.source_count,
    c.id AS country_id,
    c.country AS country_name,
	cc.country_count,
    t.id AS territory_id,
    t.territory AS territory_name,
	tc.territory_count,
    l.id AS local_id,
    l.local AS local_name,
	lc.local_count
FROM
    sources s
JOIN source_counts sc ON s.id = sc.source_id
JOIN country_counts cc ON s.id = cc.source_id
JOIN countries c ON cc.country_id = c.id
JOIN territory_counts tc ON s.id = tc.source_id AND c.id = tc.country_id
JOIN territories t ON tc.territory_id = t.id
JOIN local_counts lc ON s.id = lc.source_id AND c.id = lc.country_id AND t.id = lc.territory_id
JOIN locals l ON lc.local_id = l.id
ORDER BY
    s.id, c.id, t.id, l.id;
        `;

		const countsStmt = db.prepare(countsQuery);
		const locationCounts = countsStmt.all(searchQuery, searchQuery, expire_by);

		const totalStmt = db.prepare(`
            SELECT COUNT(DISTINCT id) as total
            FROM items
			WHERE (title LIKE ? OR location LIKE ?)
			AND (timestamp > ?)
        `);

		let total: SQLOutputValue | undefined;

		const totalres = totalStmt.get(searchQuery, searchQuery, expire_by);
		if (totalres !== undefined) {
			total = totalres.total;
		}

		db.close();

		const metadata: MetadataProps = {
			total: Number(total),
			sources: [], // sources > countries > territories > locals
		};

		const sourceMap = new Map();
		const countryMap = new Map();
		const territoryMap = new Map();

		for (const res of locationCounts) {
			if (!sourceMap.has(res.source_id)) {
				const source: DataSourceProps = {
					id: Number(res.source_id),
					name: String(res.source_name),
					count: Number(res.source_count) ?? 0,
					countries: [],
				};

				sourceMap.set(res.source_id, source);
				metadata.sources.push(source);
			}

			const source = sourceMap.get(res.source_id);
			const countryKey = `${res.source_id}-${res.country_id}`;
			if (!countryMap.has(countryKey)) {
				const country: DataCountryProps = {
					id: Number(res.country_id),
					name: String(res.country_name),
					count: Number(res.country_count) ?? 0,
					territories: [],
				};

				countryMap.set(countryKey, country);
				source.countries.push(country);
			}

			const country = countryMap.get(countryKey);
			const territoryKey = `${res.source_id}-${res.country_id}-${res.territory_id}`;
			if (!territoryMap.has(territoryKey)) {
				const territory: DataTerritoryProps = {
					id: Number(res.territory_id),
					name: String(res.territory_name),
					count: Number(res.territory_count) ?? 0,
					locals: [],
				};

				territoryMap.set(territoryKey, territory);
				country.territories.push(territory);
			}

			const territory = territoryMap.get(territoryKey);
			if (res.local_id) {
				territory.locals.push({
					id: Number(res.local_id),
					name: String(res.local_name),
					count: Number(res.local_count) ?? 0,
				} as DataLocalProps);
			}
		}

		return NextResponse.json<MetadataResponse>(
			{
				metadata: metadata,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
