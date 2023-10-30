"use client"

import { useEffect, useState, ReactNode } from "react";
import { SearchResultList } from './search-result-list';
import { SearchResultInput } from './search-result-input';
import { useSession } from "next-auth/react";

interface SearchResultProps {
  resultList: any;
}

export function SearchResult({ resultList }: SearchResultProps) {
  const [searchText, setSearchText] = useState("");
  const [resultCount, setResultCount] = useState(0);
  const [totalResultCount, setTotalResultCount] = useState(0);

  const searchFilter = (resultList: any[], searchText: string) => {
    if (!resultList) {
      return [];
    }

    const formattedSearchText = searchText.toLowerCase().replace(/\s/g, "_");

    return resultList.filter(
      (result: any) =>
        result.title.toLowerCase().includes(searchText.toLowerCase()) ||
        result.location.toLowerCase().includes(searchText.toLowerCase()) ||
        result.sources.toLowerCase().split(",").some((source: string) => source.includes(formattedSearchText))
    );
  };

  const sortedResults = searchFilter(resultList, searchText);

  sortedResults.sort((a, b) => {
    const timeA = new Date(a.time_added).getTime();
    const timeB = new Date(b.time_added).getTime();
    return timeB - timeA;
  });

  useEffect(() => {
    if (resultList) {
      setTotalResultCount(resultList.length);
      setResultCount(sortedResults.length);
    }
  }, [resultList, sortedResults]);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  return (
    <>
      <Auth>
        <SearchResultInput
          onSearch={handleSearch}
          resultCount={resultCount}
          totalResultCount={totalResultCount}
        />

        <SearchResultList
          results={sortedResults}
        />
      </Auth>
    </>
  );
}

function Auth({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession({ required: true });
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to log in to access this page.</div>;
  }
  return children;
}
