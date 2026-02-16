import "./globals.css";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="dark:bg-[#0f0f0f]">

        <div className="hidden lg:flex min-h-screen">

          <LeftSidebar />

          <main className="flex-1  overflow-y-auto">
            {children}
          </main>

          <RightSidebar />

        </div>

        {/* MOBILE */}
        <div className="lg:hidden px-5 py-6">
          {children}
        </div>

    
      </body>

    </html>
  );
}
