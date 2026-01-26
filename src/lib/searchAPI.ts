import { HOSTNAME } from '@/globals/global';

const uri = `${HOSTNAME}/api/query`;

export async function getResultsList() {
	try {
		console.log(uri);
		const req = await fetch(uri, {
			method: 'GET',
			//      cache: 'no-cache',
			next: {
				revalidate: 5,
			},
		});
		const res = await req.json();
		return res.results;
	} catch (error) {
		console.error('Error parsing response:', error);
		return [];
	}
}
