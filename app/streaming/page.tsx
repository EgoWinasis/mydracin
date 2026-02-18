"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense, useRef } from "react";
import axios from "axios";
import Skeleton from "@/components/Skeleton";

interface Video {
  quality: number;
  videoPath: string;
}

interface Episode {
  chapterId: string;
  chapterName: string;
  cdnList: {
    cdnDomain: string;
    isDefault: number;
    videoPathList: Video[];
  }[];
}

interface Movie {
  bookId: string;
  bookName: string;
  episodes: Episode[];
}

export const dynamic = "force-dynamic";

export default function StreamingPageWrapper() {
  return (
    <Suspense fallback={<p className="text-white p-6">Loading...</p>}>
      <StreamingPage />
    </Suspense>
  );
}

function StreamingPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const chapterId = searchParams.get("chapterId");

  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<string | null>(null);
  const toastShown = useRef(false);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    if (!bookId) return;

    axios
      .get(
        `https://dramabox.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`
      )
      .then((res) => {
        const episodes: Episode[] = res.data;

        if (!episodes || episodes.length === 0) {
          throw new Error("Data episode kosong");
        }

        const idx = episodes.findIndex(
          (ep) => ep.chapterId === chapterId
        );

        setMovie({
          bookId,
          bookName: "Movie",
          episodes,
        });

        setCurrentEpisodeIndex(idx >= 0 ? idx : 0);
        setLoading(false); // ✅ skeleton hilang hanya jika sukses
      })
      .catch(() => {
        // ❌ error → skeleton tetap muncul
        if (!toastShown.current) {
          toastShown.current = true;
          setToast("Gagal memuat data streaming. Silakan coba lagi.");

          setTimeout(() => {
            setToast(null);
            toastShown.current = false;
          }, 10000); // ✅ 10 detik
        }
      });
  }, [bookId, chapterId]);

  // =========================
  // SET DEFAULT VIDEO
  // =========================
  useEffect(() => {
    if (!movie) return;

    const ep = movie.episodes[currentEpisodeIndex];
    if (!ep || ep.cdnList.length === 0) return;

    const defaultCdn =
      ep.cdnList.find((cdn) => cdn.isDefault === 1) || ep.cdnList[0];

    const videoList = defaultCdn.videoPathList;
    if (!videoList || videoList.length === 0) return;

    const lowestRes = [...videoList].sort(
      (a, b) => a.quality - b.quality
    )[0];

    setCurrentVideo(lowestRes);
  }, [movie, currentEpisodeIndex]);

  if (!bookId || !chapterId)
    return (
      <p className="text-white p-6">
        Book ID atau Chapter ID tidak ditemukan
      </p>
    );

  // =========================
  // SKELETON (TETAP MUNCUL SAAT ERROR)
  // =========================
  if (loading) {
    return (
      <div className="bg-[#0f0f0f] min-h-screen p-6 text-white">
        {toast && (
          <div className="fixed top-5 right-5 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {toast}
          </div>
        )}

        <Skeleton className="h-96 w-full rounded-lg mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
      </div>
    );
  }

  if (!movie) return null;

  const currentEpisode = movie.episodes[currentEpisodeIndex];
  const videoList =
    currentEpisode?.cdnList.find((cdn) => cdn.isDefault === 1)
      ?.videoPathList || [];

  const goNextEpisode = () => {
    if (currentEpisodeIndex < movie.episodes.length - 1) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const goPrevEpisode = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6 text-white w-full mx-auto">
      {toast && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{movie.bookName}</h1>

      {/* VIDEO PLAYER */}
      {currentVideo ? (
        <video
          key={currentVideo.videoPath}
          src={currentVideo.videoPath}
          controls
          autoPlay
          className="w-full rounded-lg shadow-lg mb-4"
        />
      ) : (
        <p className="mb-4">Video tidak tersedia untuk episode ini.</p>
      )}

      {/* RESOLUTION & NAV */}
      {videoList.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <span>Resolution:</span>

          <select
            className="bg-gray-800 text-white p-1 rounded"
            value={currentVideo?.quality}
            onChange={(e) => {
              const q = parseInt(e.target.value);
              const newVideo = videoList.find((v) => v.quality === q);
              if (newVideo) setCurrentVideo(newVideo);
            }}
          >
            {[...videoList]
              .sort((a, b) => b.quality - a.quality)
              .map((v) => (
                <option key={v.quality} value={v.quality}>
                  {v.quality}p
                </option>
              ))}
          </select>

          <button
            onClick={goPrevEpisode}
            disabled={currentEpisodeIndex === 0}
            className="bg-gray-800 hover:bg-red-600 p-2 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={goNextEpisode}
            disabled={
              currentEpisodeIndex === movie.episodes.length - 1
            }
            className="bg-gray-800 hover:bg-red-600 p-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* EPISODE LIST */}
      <h2 className="text-xl font-semibold mb-4">All Episodes</h2>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movie.episodes.map((ep, idx) => (
          <li
            key={ep.chapterId}
            className={`p-3 rounded cursor-pointer transition ${
              idx === currentEpisodeIndex
                ? "bg-red-600"
                : "bg-gray-800 hover:bg-red-600"
            }`}
            onClick={() => setCurrentEpisodeIndex(idx)}
          >
            {ep.chapterName}
          </li>
        ))}
      </ul>
    </div>
  );
}
