"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Skeleton from "@/components/Skeleton";
import axios from "axios";

interface Video {
  quality: number;
  videoPath: string;
}

interface Episode {
  chapterId: string;
  chapterName: string;
  videoList: Video[];
}

interface Movie {
  bookId: string;
  bookName: string;
  episodes: Episode[];
}

export default function StreamingPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const chapterId = searchParams.get("chapterId");

  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;

    setLoading(true);
    // Ambil semua episode berdasarkan bookId
    axios
      .get(`https://dramabox.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`)
      .then((res) => {
        const episodes = res.data;
        const idx = episodes.findIndex((ep: Episode) => ep.chapterId === chapterId);
        setMovie({ bookId, bookName: res.data.bookName || "Movie", episodes });
        setCurrentEpisodeIndex(idx >= 0 ? idx : 0);
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [bookId, chapterId]);

  // Set current video resolusi default (terendah) saat episode berubah
  useEffect(() => {
    if (!movie) return;
    const ep = movie.episodes[currentEpisodeIndex];
    if (ep) {
      const lowestRes = [...ep.videoList].sort((a, b) => a.quality - b.quality)[0];
      setCurrentVideo(lowestRes);
    }
  }, [movie, currentEpisodeIndex]);

  if (!bookId || !chapterId)
    return <p className="text-white p-6">Book ID or Chapter ID not provided</p>;
  if (loading)
    return (
      <div className="bg-[#0f0f0f] min-h-screen p-6 text-white">
        <Skeleton className="h-96 w-full rounded-lg mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
      </div>
    );
  if (!movie) return <p className="text-white p-6">Movie not found</p>;

  const currentEpisode = movie.episodes[currentEpisodeIndex];

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
    <div className="bg-[#0f0f0f] min-h-screen p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{movie.bookName}</h1>

      {/* Video Player */}
      {currentVideo && (
        <video
          key={currentVideo.videoPath} // reload video saat ganti resolusi atau episode
          src={currentVideo.videoPath}
          controls
          autoPlay
          className="w-full rounded-lg shadow-lg mb-4"
        >
          Your browser does not support the video tag.
        </video>
      )}

      {/* Resolusi Dropdown */}
      {currentEpisode && (
        <div className="flex items-center gap-4 mb-6">
          <span>Resolution:</span>
          <select
            className="bg-gray-800 text-white p-1 rounded"
            value={currentVideo?.quality}
            onChange={(e) => {
              const q = parseInt(e.target.value);
              const newVideo = currentEpisode.videoList.find((v) => v.quality === q);
              if (newVideo) setCurrentVideo(newVideo);
            }}
          >
            {currentEpisode.videoList
              .sort((a, b) => b.quality - a.quality)
              .map((v) => (
                <option key={v.quality} value={v.quality}>
                  {v.quality}p
                </option>
              ))}
          </select>

          {/* Navigasi Episode */}
          <button
            onClick={goPrevEpisode}
            disabled={currentEpisodeIndex === 0}
            className="bg-gray-800 hover:bg-red-600 p-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={goNextEpisode}
            disabled={currentEpisodeIndex === movie.episodes.length - 1}
            className="bg-gray-800 hover:bg-red-600 p-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Episode List */}
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
