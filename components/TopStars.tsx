"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";
import axios from "axios";
import { FaFire } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Drama {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount: number;
  tags: string[];
  rankVo: {
    hotCode: string;
  };
}

export default function PopularSearch() {
  const [data, setData] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://dramabox.sansekai.my.id/api/dramabox/populersearch")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg lg:text-xl font-semibold mb-6 dark:text-white">
        <FaFire className="text-red-500" />
        Popular Search
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[260px] rounded-2xl" />
            ))
          : data.map((item) => (
              <Card key={item.bookId} item={item} />
            ))}
      </div>
    </div>
  );
}

function Card({ item }: { item: Drama }) {
  const [imgLoading, setImgLoading] = useState(true);

   const router = useRouter(); // <-- init router

  const handleClick = () => {
    router.push(`/detail?bookId=${item.bookId}`); // <-- navigasi ke halaman detail
  };


  return (
    <div 
      onClick={handleClick}
    className="group bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {imgLoading && (
          <Skeleton className="absolute inset-0" />
        )}

        <Image
          src={item.coverWap}
          alt={item.bookName}
          fill
          loading="lazy"
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setImgLoading(false)}
        />

        {/* Hot Badge */}
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow">
          🔥 {item.rankVo?.hotCode}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-semibold dark:text-white line-clamp-2">
          {item.bookName}
        </h3>

        <p className="text-xs text-gray-500">
          {item.chapterCount} Episodes
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {item.tags?.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
