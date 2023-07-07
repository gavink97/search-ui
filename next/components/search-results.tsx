"use client"
import { ResultCard } from "./result-card";
import { useState} from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface SearchResultProps {
    resultList: any;
  }

export function SearchResult({ resultList }: SearchResultProps) {
  const [searchText, setSearchText] = useState("");

    console.log(resultList);
// implement searchfilter function by location / source
    const searchFilter = (resultList: any) => {
        return resultList.filter(
            (result: any) => result.title.toLowerCase().includes(searchText.toLowerCase())
        )
    }

    const filteredResults = searchFilter(resultList);

    return (
        <>
        <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
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
                    <ResultCard ID={result.id} name={result.title} price={result.price} source={result.source} 
                    timestamp={result.post_timestamp} location={result.location} post={result.post_url} image={result.image_path}/>
                )
            })}
      </div>
        </>
    )

}