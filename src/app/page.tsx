import { SearchResult } from '@/components/search/search-results';
import { getResultsList } from '@/lib/searchAPI';

export default async function Page() {
	const resultList = await getResultsList();

	return (
		<div id='ui'>
			<div id='sidebar'></div>
			<SearchResult resultList={resultList} />
		</div>
	);
}
