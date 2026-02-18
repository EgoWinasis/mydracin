"use client";

import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Skeleton from "@/components/Skeleton";
import toast from "react-hot-toast";

interface Tag {
  tagId: number;
  tagName: string;
  tagEnName: string;
}

interface MovieDetail {
  bookId: string;
  bookName: string;
  coverWap: string;
  introduction: string;
  chapterCount: number;
  tags: string[];
  tagV3s: Tag[];
}

interface Episode {
  chapterId: string;
  chapterName: string;
  chapterIndex: number;
}

export const dynamic = "force-dynamic";

export default function DetailPageWrapper() {
  return (
    <Suspense fallback={<p className="text-white p-6">Loading...</p>}>
      <DetailPage />
    </Suspense>
  );
}

function DetailPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [errorShown, setErrorShown] = useState(false);

  // ================= DETAIL =================
  useEffect(() => {
    if (!bookId) return;

    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `https://dramabox.sansekai.my.id/api/dramabox/detail?bookId=${bookId}`,
          { timeout: 10000 } // ✅ timeout 10 detik
        );

        setDetail(res.data);
        setLoadingDetail(false); // ✅ hanya hilang kalau sukses
      } catch (err) {
        console.error(err);

        if (!errorShown) {
          toast.error(
            "Server sedang bermasalah atau terlalu lama merespon."
          );
          setErrorShown(true);
        }

        // ❌ loadingDetail tidak dimatikan → skeleton tetap tampil
      }
    };

    fetchDetail();
  }, [bookId]);

  // ================= EPISODES =================
  useEffect(() => {
    if (!bookId) return;

    const fetchEpisodes = async () => {
      try {
        const res = await axios.get(
          `https://dramabox.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`,
          { timeout: 10000 }
        );

        setEpisodes(res.data);
        setLoadingEpisodes(false); // ✅ hanya hilang kalau sukses
      } catch (err) {
        console.error(err);

        if (!errorShown) {
          toast.error(
            "Server sedang bermasalah atau terlalu lama merespon."
          );
          setErrorShown(true);
        }

        // ❌ loadingEpisodes tidak dimatikan
      }
    };

    fetchEpisodes();
  }, [bookId]);

  if (!bookId)
    return <p className="text-white p-6">Book ID not provided</p>;

  // ================= DETAIL SKELETON =================
  if (loadingDetail)
    return (
      <div className="bg-[#0f0f0f] min-h-screen p-6 text-white">
        <Skeleton className="h-96 w-full rounded-lg mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );

  if (!detail)
    return (
      <p className="bg-[#0f0f0f] min-h-screen p-6 text-white">
        Data not found
      </p>
    );

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6 text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={detail.coverWap}
          alt={detail.bookName}
          className="w-full md:w-64 rounded-lg shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{detail.bookName}</h1>
          <p className="mt-2 text-gray-300">{detail.introduction}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {detail.tagV3s.map((tag) => (
              <span
                key={tag.tagId}
                className="bg-red-600 px-2 py-1 rounded text-sm font-medium"
              >
                {tag.tagName}
              </span>
            ))}
          </div>

          <p className="mt-4 text-gray-400">
            Total Episode: {detail.chapterCount}
          </p>
        </div>
      </div>

      {/* Episode List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Episodes</h2>

        {loadingEpisodes ? (
          <Skeleton className="h-96 w-full rounded-lg" />
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {episodes.map((ep) => (
              <li
                key={ep.chapterId}
                className="bg-gray-800 hover:bg-red-600 transition p-3 rounded cursor-pointer"
                onClick={() =>
                  (window.location.href = `/streaming?bookId=${bookId}&chapterId=${ep.chapterId}`)
                }
              >
                <p className="font-medium">
                  {ep.chapterName || `Episode ${ep.chapterIndex + 1}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
