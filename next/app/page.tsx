import { SearchResult } from '@/components/search-results'
import { ResultCard } from '@/components/result-card'
import { getResultsList } from '@/lib/searchAPI'

export default async function Home() {
  const resultList = await getResultsList();
  return (
    <SearchResult resultList={resultList} />
  );
}
