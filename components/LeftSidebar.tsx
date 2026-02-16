"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaFire,
  FaClock,
  FaStar,
  FaCrown,
  FaRandom,
  FaInfoCircle,
  FaPhone
} from "react-icons/fa";

export default function LeftSidebar() {
  const pathname = usePathname();

  const menus = [
    { name: "Home", icon: FaHome, href: "/" },
    { name: "Trending", icon: FaFire, href: "/trending" },
    { name: "Latest", icon: FaClock, href: "/latest" },
    { name: "For You", icon: FaStar, href: "/foryou" },
    { name: "VIP", icon: FaCrown, href: "/vip" },
    { name: "Random", icon: FaRandom, href: "/random" },
    { name: "About", icon: FaInfoCircle, href: "/about" },
    { name: "Contact", icon: FaPhone, href: "/contact" },
  ];

  return (
    <aside className="w-52 bg-[#141414] p-6 shadow-[6px_0_20px_-5px_rgba(0,0,0,0.3)] min-h-screen">

      <h1 className="text-xl font-bold mb-10 text-white">
        <span className="text-red-500">◉</span> MyDracin<span className="text-red-500">.</span>
      </h1>

      <nav className="space-y-6">
        {menus.map((menu, i) => {
          const Icon = menu.icon;
          const isActive = pathname === menu.href;

          return (
            <Link
              key={i}
              href={menu.href}
              className={`
                group flex items-center space-x-3 py-2 pr-6
                transition-all duration-300
                ${
                  isActive
                    ? "text-white font-bold border-r-4 border-r-red-600 translate-x-2"
                    : "text-gray-300 hover:text-white hover:translate-x-2 hover:border-r-4 hover:border-r-red-600 hover:font-bold"
                }
              `}
            >
              <Icon className="text-lg transition-transform duration-300 group-hover:scale-110" />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
