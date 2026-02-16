"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";

interface Movie {
  bookId: string;
  bookName: string;
  coverWap: string;
  introduction: string;
  rankVo?: {
    hotCode: string;
  };
}

export default function Hero() {
  const [data, setData] = useState<Movie[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch API
  useEffect(() => {
    axios
      .get("https://dramabox.sansekai.my.id/api/dramabox/trending")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  // Auto Slide
  useEffect(() => {
    if (!data.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  if (loading || !data.length) {
    return (
      <Skeleton className="w-full h-[260px] sm:h-[320px] lg:h-[480px] rounded-3xl mb-10" />
    );
  }

  const movie = data[current];

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[480px] rounded-3xl overflow-hidden mb-10">

      <Image
        src={movie.coverWap}
        alt={movie.bookName}
        fill
        sizes="100vw"
        priority
        className="object-cover transition-all duration-700"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 sm:p-8 lg:p-12 text-white max-w-2xl">

        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
          {movie.bookName}
        </h1>

        <p className="text-gray-300 mt-3 text-sm sm:text-base lg:text-lg line-clamp-3">
          {movie.introduction}
        </p>

        <div className="flex items-center gap-4 mt-6">
          <button className="bg-red-600 hover:bg-red-700 transition px-6 py-2 rounded-lg text-sm lg:text-base font-medium">
            Watch
          </button>

          <span className="text-red-500 font-semibold">
            🔥 {movie.rankVo?.hotCode}
          </span>
        </div>
      </div>

      {/* Indicator */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {data.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              current === index
                ? "w-6 bg-red-600"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>

    </div>
  );
}
