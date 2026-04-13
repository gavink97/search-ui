import type { QueryResponse } from '@/app/api/query-v2/route';
import { DefaultPageProps, type PageProps } from '@/components/search/props';

const uri = `/api/query-v2`;

export async function queryDB(options: Partial<PageProps> = {}): Promise<QueryResponse | []> {
	const defaultProps = DefaultPageProps();

	let expire_by = options.expire_by ?? defaultProps.expire_by;
	const last_id = options.last_id ?? defaultProps.last_id;
	const last_date = options.last_date ?? defaultProps.last_date;
	const order = options.order ?? defaultProps.order;
	const limit = options.limit ?? defaultProps.limit;
	const query = options.query ?? defaultProps.query;
	const locations = options.locations ?? defaultProps.locations;

	if (process.env.NODE_ENV !== 'production') {
		expire_by = '2026';
	}

	const reqBody = {
		expire_by,
		last_id,
		last_date,
		order,
		limit,
		query,
		locations,
	};

	try {
		console.log(uri);
		const req = await fetch(uri, {
			method: 'POST',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(reqBody),
		});
		const res = await req.json();
		return res;
	} catch (error) {
		console.error('Error parsing response:', error);
		return [];
	}
}
