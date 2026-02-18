"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";
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

export default function PopularSearch() {
  const [data, setData] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://dramabox.sansekai.my.id/api/dramabox/populersearch",
          { timeout: 10000 } // auto timeout axios
        );

        if (res.data && res.data.length > 0) {
          setData(res.data);
          setLoading(false);
        } else {
          throw new Error("Data kosong");
        }
      } catch (err) {
        console.error(err);

        toast.error("Server sedang bermasalah atau terlalu lama merespon.");

        // skeleton tetap tampil
        setLoading(true);
      }
    };

    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg lg:text-xl font-semibold mb-6 text-white">
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
