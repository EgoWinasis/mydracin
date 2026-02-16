"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "@/components/Skeleton";
import Link from "next/link";
import Image from "next/image"; // <-- import next/image

interface SearchResult {
  bookId: string;
  bookName: string;
  introduction: string;
  cover: string;
  tagNames: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = () => {
    if (!query) return;
    setLoading(true);
    axios
      .get(
        `https://dramabox.sansekai.my.id/api/dramabox/search?query=${encodeURIComponent(
          query
        )}`
      )
      .then((res) => {
        setResults(res.data || []);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-gray-800 text-white p-2 rounded"
          placeholder="Search..."
        />
        <button
          onClick={search}
          className="bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <Skeleton className="h-96 w-full rounded-lg" />
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {results.map((book) => (
            <li
              key={book.bookId}
              className="bg-gray-800 p-3 rounded hover:bg-red-600 transition"
            >
              <Link href={`/detail?bookId=${book.bookId}`}>
                {/* Gunakan next/image */}
                <div className="relative w-full h-48 mb-2">
                  <Image
                    src={book.cover}
                    alt={book.bookName}
                    fill
                    className="rounded object-cover"
                  />
                </div>

                <h2 className="font-medium">{book.bookName}</h2>
                <p className="text-gray-400 text-sm line-clamp-3">
                  {book.introduction}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {book.tagNames.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-red-600 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
