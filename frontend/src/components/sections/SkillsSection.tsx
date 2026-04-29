"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { useLanguage } from "@/components/LanguageProvider";

export default function SkillsSection() {
  const { t } = useLanguage();
  return (
    <section id="skills" className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="section-title">{t("skillsKicker")}</p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white">{t("skillsTitle")}</h2>
            <p className="mt-4 text-white/70">{t("skillsDesc")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:border-cyan-400/60 hover:text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="relative h-72">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-transparent to-pink-500/20" />
            <motion.div
              className="relative h-full rounded-3xl border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="neon-ring flex h-40 w-40 items-center justify-center rounded-full border border-white/10">
                  <span className="text-sm uppercase tracking-[0.3em] text-white/60">Orbit</span>
                </div>
              </div>
              {skills.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item}
                  className="absolute left-1/2 top-1/2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/70"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 14 + index * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: `${80 + index * 12}px 0px`,
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
