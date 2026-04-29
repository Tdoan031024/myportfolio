"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const HeroScene = dynamic(() => import("../HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-3xl glass" aria-hidden="true" />
  ),
});

export default function HeroSection() {
  const { t } = useLanguage();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const glow = useMemo(
    () =>
      `radial-gradient(600px circle at ${pointer.x}% ${pointer.y}%, rgba(82,245,255,0.2), transparent 60%)`,
    [pointer],
  );

  return (
    <section
      id="hero"
      className="relative overflow-hidden px-6 pb-24 pt-24 md:px-16"
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setPointer({ x, y });
      }}
      style={{ backgroundImage: glow }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="section-title">{t("heroKicker")}</p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-4xl font-semibold leading-tight text-ink md:text-6xl"
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-white/70"
          >
            {t("heroDesc")}
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="neon-ring rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              {t("heroCtaProjects")}
            </button>
            <button className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40">
              {t("heroCtaContact")}
            </button>
          </div>
        </div>
        <div className="relative h-[360px] flex-1">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-pink-500/20" />
          <div className="relative h-full overflow-hidden rounded-3xl border border-white/10">
            <HeroScene />
          </div>
        </div>
      </div>
    </section>
  );
}
