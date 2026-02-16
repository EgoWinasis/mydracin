"use client";

export default function Footer() {
  return (
    <footer className="w-full py-4 text-center text-xs text-gray-500 dark:text-gray-300 bg-[#141414] ">
      © {new Date().getFullYear()} MyDracin. All rights reserved.
    </footer>
  );
}
