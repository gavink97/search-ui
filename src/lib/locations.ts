//const uri = `${HOSTNAME}/api/location`;
const uri = `/api/location`;

export async function queryLocations() {
	try {
		console.log(uri);
		const req = await fetch(uri, {
			method: 'GET',
			cache: 'no-store',
		});
		const res = await req.json();
		return res;
	} catch (error) {
		console.error('Error parsing response:', error);
		return [];
	}
}
