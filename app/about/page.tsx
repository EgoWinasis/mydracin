"use client";

import { FaFilm, FaHeart } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 lg:px-16 py-12 bg-gray-50 dark:bg-[#0f0f0f]">

      {/* HERO */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4">
          About <span className="text-red-600">MyDracin.</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Platform eksplorasi drama yang menampilkan trending, popular search,
          dan rekomendasi pilihan dalam satu tampilan modern dan simpel.
        </p>
      </div>

      {/* INFO CARDS */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">

        <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <FaFilm className="text-red-600 text-2xl mb-4" />
          <h3 className="font-semibold dark:text-white mb-2">
            Tentang Platform
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            MyDracin dibuat sebagai media eksplorasi dan tampilan daftar
            drama populer dengan desain modern, ringan, dan responsif.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <FaHeart className="text-red-600 text-2xl mb-4" />
          <h3 className="font-semibold dark:text-white mb-2">
            Dibuat untuk Pembelajaran
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Website ini dibuat hanya untuk tujuan pembelajaran dan pengembangan
            skill, bukan untuk keperluan komersial.
          </p>
        </div>

      </div>

      {/* DISCLAIMER */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#1c1c1c] p-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold dark:text-white mb-6">
          Disclaimer
        </h2>

        <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          <p>
            Semua konten dan informasi yang ditampilkan di MyDracin
            hanya sebagai referensi dan eksplorasi tampilan.
          </p>

          <p>
            🎬 Untuk pengalaman menonton terbaik dan mendukung industri kreatif,
            silakan tonton drama favorit Anda melalui layanan streaming resmi
            dan legal.
          </p>

          <p className="font-medium dark:text-white">
            Website ini tidak digunakan untuk tujuan komersial.
          </p>
        </div>
      </div>

      
    </div>
  );
}
