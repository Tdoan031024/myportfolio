"use client";

import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-16">
        <span className="text-sm font-semibold tracking-[0.3em] text-white">DOAN</span>
        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          {[
            [t("navHero"), "#hero"],
            [t("navSkills"), "#skills"],
            [t("navProjects"), "#projects"],
            [t("navAbout"), "#about"],
            [t("navContact"), "#contact"],
            [t("navSubscribe"), "#subscribe"],
            [t("navDocs"), "#blog"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <button className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80">
            {t("downloadCv")}
          </button>
        </div>
      </div>
    </header>
  );
}
