"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Skeleton from "@/components/Skeleton";
import axios from "axios";
import { FaFire } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

const PopularSearch: React.FC = () => {
  const [data, setData] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [errorShown, setErrorShown] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCardRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<Drama[]>(
          `https://dramabox.sansekai.my.id/api/dramabox/dubindo?classify=terbaru&page=${page}`,
          {
            timeout: 10000, // ✅ timeout 10 detik
          }
        );

        if (res.data.length === 0) {
          setHasMore(false);
        } else {
          setData((prev) => [...prev, ...res.data]);
        }

        // ✅ Skeleton hilang hanya jika sukses
        setLoading(false);
      } catch (err) {
        console.error(err);

        // ✅ Toast hanya muncul 1x
        if (!errorShown) {
          toast.error(
            "Server sedang bermasalah atau terlalu lama merespon."
          );
          setErrorShown(true);
        }

        // ❌ loading tidak dimatikan → skeleton tetap tampil
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6">
      <h2 className="flex items-center gap-2 text-lg lg:text-xl font-semibold mb-6 text-white">
        <FaFire className="text-red-500" />
        Dub Indo
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {data.map((item, index) => {
          if (index === data.length - 1) {
            return <Card ref={lastCardRef} key={item.bookId} item={item} />;
          }
          return <Card key={item.bookId} item={item} />;
        })}

        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[260px] rounded-2xl" />
          ))}
      </div>

      {!hasMore && !loading && (
        <p className="text-center text-gray-400 mt-6">No more data</p>
      )}
    </div>
  );
};

// ================= CARD =================

const Card = React.forwardRef<HTMLDivElement, { item: Drama }>(
  ({ item }, ref) => {
    const [imgLoading, setImgLoading] = useState(true);
    const router = useRouter();

    const handleClick = () => {
      router.push(`/detail?bookId=${item.bookId}`);
    };

    return (
      <div
        onClick={handleClick}
        ref={ref}
        className="group bg-[#1a1a1a] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          {imgLoading && <Skeleton className="absolute inset-0" />}

          {item.coverWap ? (
            <Image
              src={item.coverWap}
              alt={item.bookName || "Drama Cover"}
              fill
              loading="lazy"
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imgLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setImgLoading(false)}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}

          {item.rankVo?.hotCode && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 shadow">
              🔥 {item.rankVo.hotCode}
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {item.bookName}
          </h3>

          <p className="text-xs text-gray-400">
            {item.chapterCount} Episodes
          </p>

          <div className="flex flex-wrap gap-1">
            {item.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default PopularSearch;
