import { SearchResult } from '@/components/search/search-results'
import { ResultCard } from '@/components/search/result-card'
import { getResultsList } from '@/lib/searchAPI'

export default async function Home() {
  const resultList = await getResultsList();
  return (
      <SearchResult resultList={resultList} />
      
  );
}