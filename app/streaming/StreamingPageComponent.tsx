// app/streaming/page.tsx
import StreamingPage from "./StreamingPageComponent";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // wajib supaya CSR

export default function StreamingPageWrapper() {
  return (
    <Suspense fallback={<p className="text-white p-6">Loading...</p>}>
      <StreamingPage />
    </Suspense>
  );
}
