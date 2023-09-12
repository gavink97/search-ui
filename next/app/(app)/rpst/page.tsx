import { SearchResult } from '@/components/search/search-results'
import { ResultCard } from '@/components/search/result-card'
import { getResultsList } from '@/lib/searchAPI'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/components/auth/auth.config"

export default async function RPST() {
    const session = await getServerSession(authOptions)
        console.log("session in RPST:", session)
        const resultList = await getResultsList();
    return (
            <>
            <div className='flex flex-col'>
            <SearchResult resultList={resultList} />
            </div>
            </>
           );
}
