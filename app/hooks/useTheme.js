"use client";

import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Ambil theme dari localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Update HTML class
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Simpan
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
}
