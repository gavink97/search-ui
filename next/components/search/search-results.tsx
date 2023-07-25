"use client"

import { ResultCard } from "./result-card";
import { useState} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

interface SearchResultProps {
    resultList: any;
  }

export function SearchResult({ resultList }: SearchResultProps) {
  const [searchText, setSearchText] = useState("");

    const searchFilter = (resultList: any[], searchText: string) => {

      if (!resultList) {
        return [];
      }

      const formattedSearchText = searchText.toLowerCase().replace(/\s/g, '_');
      
      return resultList.filter((result: any) =>
        result.title.toLowerCase().includes(searchText.toLowerCase()) ||
        result.source.toLowerCase().replace(/\s/g, '_').includes(formattedSearchText) ||
        result.location.toLowerCase().includes(searchText.toLowerCase())
      );
    };
    
    const filteredResults = searchFilter(resultList, searchText);

    return (
    <>
        <Auth>
          <div>
            <div className="grid w-full max-w-sm mb-6 mt-2 items-center gap-1.5">
                <Label htmlFor="searchResultId"></Label>
                <Input type="text" value={searchText}
                autoComplete="off"
                id="searchResultId"
                placeholder="Search for a record player"
                onChange={(e) => setSearchText(e.target.value)}
               />
            </div>
          </div>

          <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
            {filteredResults.map((result : any) => {
                return (
                    <ResultCard name={result.title} price={result.price} source={result.source} 
                    timestamp={result.post_timestamp} location={result.location} post={result.post_url} image={result.image_path}/>
                )
            })}
          </div>
        </Auth>
    </>
  )
}

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true });
  console.log('Session data in Search results:', session);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to log in to access this page.</div>;
  }

  return children
}