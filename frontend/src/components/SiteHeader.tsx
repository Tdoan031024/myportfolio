"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function SiteHeader() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const raf = window.requestAnimationFrame(() => setEntered(true));
    return () => window.cancelAnimationFrame(raf);
  }, [visible]);

  if (!mounted || !visible) {
    return null;
  }

  return createPortal(
    <header
      className={`fixed left-0 top-0 w-full !z-[100] bg-transparent transition-all duration-[1400ms] ease-out ${
        entered ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-16">
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
    ,
    document.body,
  );
}
