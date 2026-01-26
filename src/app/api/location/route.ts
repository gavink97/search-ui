import sqlite from 'node:sqlite';
import { NextResponse } from 'next/server';
import { DB_NAME } from '@/globals/global';

export async function GET() {
	try {
		const db = new sqlite.DatabaseSync(DB_NAME, {
			readOnly: true,
			enableForeignKeyConstraints: true,
		});

		const query = 'SELECT s.source FROM sources s';

		const stmt = db.prepare(query);
		const rows = stmt.all();

		db.close();
		return NextResponse.json({ results: rows }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
	}
}
