// /app/streaming/page.tsx
import StreamingPageClient from "./StreamingPageClient";

export const dynamic = "force-dynamic"; // pastikan CSR

export default function StreamingPageWrapper() {
  return <StreamingPageClient />;
}
