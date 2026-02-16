"use client";

import "./globals.css";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className="dark:bg-[#0f0f0f] min-h-screen">

        {/* DESKTOP */}
        <div className="hidden lg:flex min-h-screen">
          <LeftSidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <RightSidebar />
        </div>

        {/* MOBILE */}
        <div className="lg:hidden relative">
          {/* Hamburger */}
          <button
            className="fixed top-4 left-4 z-50 p-3 rounded-md bg-gray-800 text-white shadow-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Sidebar Overlay */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Sidebar Mobile */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-[#141414] z-50 transform transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <main className="px-5 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
