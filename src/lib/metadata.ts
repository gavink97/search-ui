import type { MetadataResponse } from '@/app/api/metadata/route';
import { DefaultPageProps, type PageProps } from '@/components/search/props';

const uri = `/api/metadata`;

export async function queryMetadata(options: Partial<PageProps> = {}): Promise<MetadataResponse | []> {
	const defaultProps = DefaultPageProps();

	let expire_by = options.expire_by ?? defaultProps.expire_by;
	const query = options.query ?? defaultProps.query;

	if (process.env.NODE_ENV !== 'production') {
		expire_by = '2026';
	}

	const reqBody = {
		expire_by,
		query,
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
