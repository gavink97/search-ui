import { SearchResult } from '@/components/search/search-results'
import { ResultCard } from '@/components/search/result-card'
import { getResultsList } from '@/lib/searchAPI'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/components/auth/auth.config"

export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log("session in homepage:", session)
  const resultList = await getResultsList();
  return (
    <>
      <SearchResult resultList={resultList} />
    </>
  );
}
