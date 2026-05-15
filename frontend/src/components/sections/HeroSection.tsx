"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function HeroSection() {
  const { t } = useLanguage();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const glow = useMemo(
    () =>
      `radial-gradient(600px circle at ${pointer.x}% ${pointer.y}%, rgba(82,245,255,0.2), transparent 60%)`,
    [pointer],
  );
  const socials = [
    {
      label: "GitHub",
      href: "https://github.com",
      svg: (
        <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.2-3.37-1.2-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.04 1.53 1.04.9 1.54 2.35 1.1 2.92.84.1-.66.35-1.1.64-1.35-2.22-.25-4.56-1.1-4.56-4.9 0-1.08.39-1.96 1.03-2.65-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.56 1.4.2 2.44.1 2.7.64.69 1.03 1.57 1.03 2.65 0 3.8-2.34 4.65-4.57 4.9.36.31.69.92.69 1.86v2.77c0 .27.18.59.69.48A10 10 0 0 0 12 2z" />
      ),
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com",
      svg: (
        <path d="M6.94 7.5H4.5V19h2.44V7.5zM5.72 4.5a1.41 1.41 0 1 0 0 2.82 1.41 1.41 0 0 0 0-2.82zM19.5 12.05c0-3.1-1.65-4.55-3.85-4.55-1.77 0-2.56.97-3 1.66V7.5H10.2V19h2.44v-6.02c0-1.58.3-3.1 2.26-3.1 1.93 0 1.95 1.8 1.95 3.2V19h2.45v-6.95z" />
      ),
    },
    {
      label: "Email",
      href: "mailto:hello@doan.tech",
      svg: (
        <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2 8 5 8-5" />
      ),
    },
  ];

  return (
    <section
      id="hero"
      className="relative z-10 -mt-56 overflow-visible bg-transparent px-6 pb-24 pt-0 md:-mt-72 md:px-16"
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        setPointer({ x, y });
      }}
      style={{ backgroundImage: glow }}
    >
      <div className="relative z-0 mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-3xl font-semibold leading-tight text-ink md:text-5xl"
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-justify text-[16px] text-white"
          >
            {t("heroDesc")}
          </motion.p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {social.svg}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
