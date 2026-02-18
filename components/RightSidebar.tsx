"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Skeleton from "./Skeleton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface TrendingItem {
  bookId: string;
  bookName: string;
  coverWap: string;
  tags: string[];
}

export default function RightSidebar({ mobile = false }) {
  const [data, setData] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          "https://dramabox.sansekai.my.id/api/dramabox/trending",
          {
            timeout: 10000, // auto timeout 10 detik
          }
        );

        if (res.data && res.data.length > 0) {
          setData(res.data);
          setLoading(false);
        } else {
          throw new Error("Data kosong");
        }
      } catch (err) {
        console.error(err);

        // Toast tidak akan duplikat
        toast.error("Server sedang bermasalah atau terlalu lama merespon.", {
          id: "trending-error",
        });

        // ❗ jangan setLoading(false)
        // biarkan skeleton tetap muncul
      }
    };

    fetchTrending();
  }, []);

  const displayedData = data.slice(0, 3);

  return (
    <aside
      className={`
        ${
          mobile
            ? ""
            : "w-70 min-h-screen shadow-[-6px_0_20px_-5px_rgba(0,0,0,0.15)]"
        }
        bg-[#141414] p-6 lg:p-8
      `}
    >
      <h3 className="font-semibold mb-6 text-white">
        Trending Movies
      </h3>

      <div className="space-y-6 transition-all duration-300">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))
          : displayedData.map((item) => (
              <MovieItem key={item.bookId} item={item} />
            ))}
      </div>

      {!loading && data.length > 3 && (
        <button
          onClick={() => router.push("/trending")}
          className="mt-8 w-full bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg text-sm"
        >
          See More
        </button>
      )}
    </aside>
  );
}

function MovieItem({ item }: { item: TrendingItem }) {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <div className="flex gap-4 group cursor-pointer">
      <div className="relative w-14 h-20 rounded-lg overflow-hidden flex-shrink-0">
        {imgLoading && (
          <Skeleton className="absolute inset-0 rounded-lg" />
        )}

        <Image
          src={item.coverWap}
          alt={item.bookName}
          fill
          loading="lazy"
          className={`object-cover transition-opacity duration-300 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setImgLoading(false)}
        />
      </div>

      <div>
        <p className="font-semibold text-white text-sm line-clamp-2 group-hover:text-red-500 transition">
          {item.bookName}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {item.tags?.slice(0, 2).join(", ")}
        </p>
      </div>
    </div>
  );
}
