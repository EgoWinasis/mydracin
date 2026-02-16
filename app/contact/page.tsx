"use client";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaTiktok,
  FaFacebook,
  FaCoffee
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 dark:bg-[#0f0f0f]">

      <div className="w-full max-w-md bg-white dark:bg-[#1c1c1c] p-10 rounded-2xl shadow-lg text-center space-y-8">

        {/* FOTO */}
        <img
          src="/profile.jpg"
          alt="Ego Winasis"
          className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-red-600 shadow-md"
        />

        {/* NAMA */}
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Ego Winasis
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fullstack Web Developer
          </p>
        </div>

        {/* KONTAK */}
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center justify-center gap-2">
            <FaEnvelope className="text-red-600" />
            <span>egowinasis@gmail.com</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <FaPhone className="text-red-600" />
            <span>+62 896-xxxx-xxxx</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <FaMapMarkerAlt className="text-red-600" />
            <span>Indonesia</span>
          </div>
        </div>

        {/* CONNECT WITH ME */}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-gray-500 dark:text-gray-400 mb-4">
            CONNECT WITH ME
          </h2>

          <div className="flex flex-wrap justify-center gap-6 text-xl">

            <a
              href="https://instagram.com/egowinasis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition transform hover:scale-110"
            >
              <FaInstagram />
            </a>

            <a
              href="https://github.com/egowinasis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition transform hover:scale-110"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/egowinasis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition transform hover:scale-110"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://tiktok.com/@egowinasis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition transform hover:scale-110"
            >
              <FaTiktok />
            </a>

            <a
              href="https://facebook.com/egowinasis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition transform hover:scale-110"
            >
              <FaFacebook />
            </a>

          </div>
        </div>

        {/* SAWERIA CARD */}
        <a
          href="https://saweria.co/egowinasis"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-yellow-400 hover:bg-yellow-500 transition rounded-xl p-4 shadow-md"
        >
          <FaCoffee className="text-2xl text-brown-800" />
          <span className="font-semibold text-black text-lg">Support me on Saweria</span>
        </a>

      </div>

    </div>
  );
}
