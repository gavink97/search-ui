"use client"

import { ResultCard } from "./result-card";
import { useEffect, useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchResultProps {
  resultList: any;
}

export function SearchResult({ resultList }: SearchResultProps) {
  const [searchText, setSearchText] = useState("");

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

  const [resultCount, setResultCount] = useState(0);
  const [totalResultCount, setTotalResultCount] = useState(0);

  useEffect(() => {
    if (resultList) {
      setTotalResultCount(resultList.length);
      setResultCount(sortedResults.length);
    }
  }, [resultList, sortedResults]);

  return (
    <>
      <Auth>
        <div className="sticky top-4 bg-white">
          <div className="grid w-full max-w-lg mb-6 mt-2 items-center gap-1.5 ">
            <Label htmlFor="searchResultId"></Label>
            <Input
              className='w-80'
              type="text"
              value={searchText}
              autoComplete="off"
              id="searchResultId"
              placeholder="Search for a brand, source or location"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="absolute top-0 left-8 px-64 py-6 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-xl container">
          <ul className="flex items-center justify-between">
            <li></li>
            <li className="text-slate-700">
              {resultCount === 1 ? (
                <p>1 result</p>
              ) : (
                <p>Displaying {resultCount} of {totalResultCount} results</p>
              )}
            </li>
          </ul>
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          {sortedResults.map((result: any) => {
            return (
              <ResultCard
                key={result.id}
                id={result.id}
                time_added={result.time_added}
                title={result.title}
                price={result.price}
                post_timestamp={result.post_timestamp}
                location={result.location}
                post_url={result.post_url}
                data_pid={result.data_pid}
                is_new={result.is_new}
                cloudinary_link={result.cloudinary_link}
                sources={result.sources}
              />
            );
          })}
        </div>
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
