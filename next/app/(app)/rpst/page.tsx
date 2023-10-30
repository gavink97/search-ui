import { SearchResult } from '@/components/search/search-results'
import { getResultsList } from '@/lib/searchAPI'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/components/auth/auth-config"

export default async function RPST() {
    const session = await getServerSession(authOptions)
        console.log("session in RPST:", session)
        const resultList = await getResultsList();
    return (
      <>
        <div className='flex flex-col items-center'>
          <SearchResult resultList={resultList} />
        </div>
      </>
    );
}
