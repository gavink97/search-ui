import sqlite from 'node:sqlite';
import { NextResponse } from 'next/server';
import type { DataCountryProps, DataLocalProps, DataTerritoryProps } from '@/components/search/props';
import { DB_NAME } from '@/globals/global';
import type { ResponseError } from '../utils';

export interface LocationResponse {
	locations: DataCountryProps[];
}

export async function GET(): Promise<NextResponse<LocationResponse> | NextResponse<ResponseError>> {
	try {
		const db = new sqlite.DatabaseSync(DB_NAME, {
			readOnly: true,
			enableForeignKeyConstraints: true,
		});

		const query = `
		Select
			l.id,
			l.local,
			l.territory_id,
			t.territory,
			l.country_id,
			c.country
		from
			locals l
		JOIN territories t ON
			l.territory_id = t.id
		JOIN countries c ON
			l.country_id = c.id;
		`;

		const stmt = db.prepare(query);
		const results = stmt.all();

		const locs: LocationResponse = {
			locations: [], // countries > territories > locals
		};

		const countryMap = new Map();
		const territoryMap = new Map();

		for (const res of results) {
			if (!countryMap.has(res.country_id)) {
				const country: DataCountryProps = {
					id: Number(res.country_id),
					name: String(res.country),
					territories: [],
				};

				countryMap.set(res.country_id, country);
				locs.locations.push(country);
			}

			const country = countryMap.get(res.country_id);
			if (!territoryMap.has(res.territory_id)) {
				const territory: DataTerritoryProps = {
					id: Number(res.territory_id),
					name: String(res.territory),
					locals: [],
				};

				territoryMap.set(res.territory_id, territory);
				country.territories.push(territory);
			}

			const territory = territoryMap.get(res.territory_id);
			if (res.id) {
				territory.locals.push({
					id: Number(res.id),
					name: String(res.local),
				} as DataLocalProps);
			}
		}

		db.close();
		return NextResponse.json<LocationResponse>({ locations: locs.locations }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
