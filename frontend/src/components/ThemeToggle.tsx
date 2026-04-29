"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/70"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
