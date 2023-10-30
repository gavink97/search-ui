"use client"

import React from 'react';
import { ResultCard } from './result-card';

interface SearchResultListProps {
  results: any[];
}

export function SearchResultList({ results }: SearchResultListProps) {
  return (
    <div className="mb-32 grid text-center justify-items-center grid-cols-1 lg:mb-0 lg:grid-cols-4 lg:text-left">
      {results.map((result: any) => (
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
      ))}
    </div>
  );
}
