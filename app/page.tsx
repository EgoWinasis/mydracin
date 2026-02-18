"use client";

import Hero from "@/components/Hero";
import TopStars from "@/components/TopStars";
import RightSidebar from "@/components/RightSidebar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] px-5 py-6 lg:px-8 lg:py-8">
      {/* Hero Section */}
      <Hero />

      {/* Top Stars Section */}
      <TopStars />

      {/* Optional: Mobile Right Sidebar */}
      <div className="lg:hidden mt-8">
        <RightSidebar mobile />
      </div>
    </main>
  );
}
