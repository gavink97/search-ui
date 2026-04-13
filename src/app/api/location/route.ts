import sqlite from 'node:sqlite';
import { NextResponse } from 'next/server';
import { DB_NAME } from '@/globals/global';

export async function GET() {
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

		const locs = {
			locations: [], // countries > territories > locals
		};

		const countryMap = new Map();
		const territoryMap = new Map();

		for (const res of results) {
			if (!countryMap.has(res.country_id)) {
				const country = {
					id: res.country_id,
					country: res.country,
					territories: [],
				};

				countryMap.set(res.country_id, country);
				locs.locations.push(country);
			}

			const country = countryMap.get(res.country_id);
			if (!territoryMap.has(res.territory_id)) {
				const territory = {
					id: res.territory_id,
					territory: res.territory,
					locals: [],
				};

				territoryMap.set(res.territory_id, territory);
				country.territories.push(territory);
			}

			const territory = territoryMap.get(res.territory_id);
			if (res.id) {
				territory.locals.push({
					id: res.id,
					local: res.local,
				});
			}
		}

		db.close();
		return NextResponse.json({ results: locs.locations }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
