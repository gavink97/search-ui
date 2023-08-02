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

  const sortedResults = searchFilter(resultList, searchText);

  const getComparableValue = (timestamp: string) => {
    const parts = timestamp.split(" ");
    if (parts[1] === "mins") {
      return -parseInt(parts[0]);
    } else if (parts[1] === "ago") {
      return -parseInt(parts[0]) * 60;
    } else {
      const [month, day] = parts[0].split("/");
      return new Date(`2023-${month}-${day}`).getTime();
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

  firstTypeResults.sort((a: any, b: any) => getComparableValue(b.post_timestamp) - getComparableValue(a.post_timestamp));
  secondTypeResults.sort((a: any, b: any) => getComparableValue(b.post_timestamp) - getComparableValue(a.post_timestamp));

  const mergedResults = [...firstTypeResults, ...secondTypeResults];

  const uniqueResults: any[] = [];
  const uniquePosts: Record<string, boolean> = {};

  mergedResults.forEach((result) => {
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
                key={result.data_pid}
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
