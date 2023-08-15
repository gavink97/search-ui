"use client"

import { ResultCard } from "./result-card";
import { useEffect, useState, ReactNode } from "react";
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

    const formattedSearchText = searchText.toLowerCase().replace(/\s/g, "_");

    return resultList.filter(
      (result: any) =>
        result.title.toLowerCase().includes(searchText.toLowerCase()) ||
        result.location.toLowerCase().includes(searchText.toLowerCase()) ||
        result.sources.toLowerCase().split(",").some((source: string) => source.includes(formattedSearchText))
    );
  };

  const sortedResults = searchFilter(resultList, searchText);

  const getComparableValue = (post_timestamp: string) => {
    const parts = post_timestamp.split(" ");

    if (parts[1] === "mins") {
      const minutesAgo = parseInt(parts[0]);
      const now = new Date();
      now.setMinutes(now.getMinutes() - minutesAgo);
      return now.toISOString();
    } else if (parts[1] === "ago") {
      const hoursAgo = parseInt(parts[0]);
      const now = new Date();
      now.setHours(now.getHours() - hoursAgo);
      return now.toISOString();
    } else {
      const [monthStr, dayStr] = parts[0].split("/");
      const month = parseInt(monthStr);
      const day = parseInt(dayStr);

      if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        return new Date().toISOString(); // Use current date as fallback
      }

      return new Date(`2023-${month}-${day}`).toISOString();
    }
  };


  const firstTypeResults: any[] = [];
  const secondTypeResults: any[] = [];

  sortedResults.forEach((result) => {
    if (result.post_timestamp.includes(" ago")) {
      firstTypeResults.push(result);
    } else {
      secondTypeResults.push(result);
    }
  });

  firstTypeResults.sort((a: any, b: any) => getComparableValue(b.post_timestamp).localeCompare(getComparableValue(a.post_timestamp)));
  secondTypeResults.sort((a: any, b: any) => getComparableValue(b.post_timestamp).localeCompare(getComparableValue(a.post_timestamp)));

  const mergedResults = [...firstTypeResults, ...secondTypeResults];


  const uniqueResults: any[] = [];
  const uniquePosts: Record<string, boolean> = {};

  mergedResults.forEach((result) => {
    const postKey = `${result.id}`;
    if (!uniquePosts[postKey]) {
      uniquePosts[postKey] = true;
      uniqueResults.push(result);
    }
  });

  const [resultCount, setResultCount] = useState(0);
  const [totalResultCount, setTotalResultCount] = useState(0);

  useEffect(() => {
    if (resultList) {
      setTotalResultCount(resultList.length);
      setResultCount(mergedResults.length);
    }
  }, [resultList, mergedResults]);

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
              placeholder="Search for a brand or location"
              onChange={(e) => setSearchText(e.target.value)}
            />
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
          {mergedResults.map((result: any) => {
            return (
              <ResultCard
                key={result.id}
                id={result.id}
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
