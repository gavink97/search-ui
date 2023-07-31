"use client"

import { ResultCard } from "./result-card";
import { useState, ReactNode } from "react";
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
        result.source.toLowerCase().replace(/\s/g, "_").includes(formattedSearchText) ||
        result.location.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const sortedResults = searchFilter(resultList, searchText).sort((a: any, b: any) => {
    const getComparableValue = (timestamp: string) => {
      const parts = timestamp.split(" ");
      if (parts.length === 2 && parts[1] === "ago") {
        return -parseInt(parts[0]);
      } else {
        const [month, day] = parts[0].split("/");
        return new Date(`2023-${month}-${day}`).getTime();
      }
    };

    const timestampA = getComparableValue(a.post_timestamp);
    const timestampB = getComparableValue(b.post_timestamp);

    return timestampB - timestampA;
  });

  const uniqueResults: any[] = [];
  const uniquePosts: Record<string, boolean> = {};

  sortedResults.forEach((result) => {
    const postKey = `${result.title}${result.image_path}`;
    if (!uniquePosts[postKey]) {
      uniquePosts[postKey] = true;
      uniqueResults.push(result);
    }
  });

  return (
    <>
      <Auth>
        <div>
          <div className="grid w-full max-w-sm mb-6 mt-2 items-center gap-1.5">
            <Label htmlFor="searchResultId"></Label>
            <Input
              type="text"
              value={searchText}
              autoComplete="off"
              id="searchResultId"
              placeholder="Search for a record player"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          {uniqueResults.map((result: any) => {
            return (
              <ResultCard
                key={result.data_pid} // Make sure to provide a key prop for each element in the array
                title={result.title}
                price={result.price}
                source={result.source}
                timestamp={result.post_timestamp}
                location={result.location}
                post={result.post_url}
                image={result.image_path}
                data_pid={result.data_pid}
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
