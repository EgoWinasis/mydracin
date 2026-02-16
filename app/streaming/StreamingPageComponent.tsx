"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Skeleton from "@/components/Skeleton";
import axios from "axios";

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

export default function StreamingPageComponent() {
  const searchParams = useSearchParams(); // aman, karena ini Client Component
  const bookId = searchParams.get("bookId");
  const chapterId = searchParams.get("chapterId");

  const [movie, setMovie] = useState<Movie | null>(null);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const episodeListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!bookId) return;

    setLoading(true);
    axios
      .get(`https://dramabox.sansekai.my.id/api/dramabox/allepisode?bookId=${bookId}`)
      .then((res) => {
        const episodes: Episode[] = res.data;
        const idx = episodes.findIndex((ep) => ep.chapterId === chapterId);
        setMovie({ bookId, bookName: "Movie", episodes });
        setCurrentEpisodeIndex(idx >= 0 ? idx : 0);
      })
      .catch(() => setMovie(null))
      .finally(() => setLoading(false));
  }, [bookId, chapterId]);

  useEffect(() => {
    if (!movie) return;
    const ep = movie.episodes[currentEpisodeIndex];
    if (ep && ep.cdnList.length > 0) {
      const defaultCdn = ep.cdnList.find((cdn) => cdn.isDefault === 1) || ep.cdnList[0];
      if (defaultCdn.videoPathList.length > 0) {
        const lowestRes = [...defaultCdn.videoPathList].sort((a, b) => a.quality - b.quality)[0];
        setCurrentVideo(lowestRes);
      } else setCurrentVideo(null);
    } else setCurrentVideo(null);
  }, [movie, currentEpisodeIndex]);

  useEffect(() => {
    if (!episodeListRef.current) return;
    const list = episodeListRef.current.children[currentEpisodeIndex] as HTMLElement;
    list?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentEpisodeIndex]);

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
  const videoList: Video[] =
    currentEpisode?.cdnList.find((cdn) => cdn.isDefault === 1)?.videoPathList || [];

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

      <div className="flex items-center gap-4 mb-6">
        {videoList.length > 0 && (
          <>
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
              {videoList
                .sort((a, b) => b.quality - a.quality)
                .map((v) => (
                  <option key={v.quality} value={v.quality}>
                    {v.quality}p
                  </option>
                ))}
            </select>
          </>
        )}
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

      <h2 className="text-xl font-semibold mb-4">All Episodes</h2>
      <ul ref={episodeListRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movie.episodes.map((ep, idx) => (
          <li
            key={ep.chapterId}
            className={`p-3 rounded cursor-pointer transition ${
              idx === currentEpisodeIndex ? "bg-red-600" : "bg-gray-800 hover:bg-red-600"
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
