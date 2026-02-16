"use client"; // PENTING: supaya halaman ini murni Client Component

import StreamingPageComponent from "./StreamingPageComponent";

export const dynamic = "force-dynamic";

export default function StreamingPageWrapper() {
  return (
    <StreamingPageComponent />
  );
}
