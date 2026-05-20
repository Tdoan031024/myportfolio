"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Experience = {
  logo: "google" | "publication" | "education";
  title: string;
  company: string;
  date: string;
  description: string;
  tags?: string[];
};

const experiences: Experience[] = [
  {
    logo: "google",
    title: "Event Scape",
    company: "Google For Developers On Campus",
    date: "Sept 2024 - Oct 2025",
    description:
      "Organized and managed technical events and workshops, coordinating teams and logistics to deliver impactful learning experiences.",
  },
  {
    logo: "publication",
    title: "Author",
    company: "Guru Shishya Publication",
    date: "Sept 2024 - Nov 2025",
    description:
      "Authored technical books and refined manuscript quality with strong documentation and formatting workflows.",
    tags: ["Computer Architecture", "Java", "IOT"],
  },
  {
    logo: "education",
    title: "Cyber Security Intern",
    company: "Edunet Foundation (VI)",
    date: "Mar 2026 - Apr 2026",
    description:
      "Worked on ethical hacking fundamentals, network security, packet analysis, cryptography, Kali Linux, Wireshark, and Nmap.",
  },
];

function SkillTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold text-cyan-200">
      {children}
    </span>
  );
}

function LogoMarker({ type }: { type: Experience["logo"] }) {
  if (type === "google") {
    return (
      <div className="flex h-full w-full items-center justify-center text-[25px] font-bold tracking-[-2px]">
        <span className="text-blue-400">G</span>
      </div>
    );
  }

  if (type === "publication") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-5 w-5 rounded-full border border-white/35">
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[54%] text-[9px] font-bold text-white/80">
            G
          </span>
          <span className="absolute -bottom-1 left-1/2 h-1.5 w-4 -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-6 w-6">
        <span className="absolute bottom-1 left-1 h-3.5 w-4 rotate-[-12deg] rounded-[3px] border border-emerald-300/35 bg-emerald-200/25" />
        <span className="absolute left-2 top-1 h-2.5 w-2.5 rounded-full bg-sky-200/75" />
        <span className="absolute bottom-1.5 right-0 h-2 w-2 rounded-full bg-lime-200/80" />
      </div>
    </div>
  );
}

function ExperienceCard({
  item,
  isPrimary = false,
}: {
  item: Experience;
  isPrimary?: boolean;
}) {
  return (
    <article
      className={`group w-full rounded-[16px] border px-7 py-7 shadow-[0_12px_35px_rgba(0,0,0,0.28)] transition-all duration-300 sm:px-8 sm:py-8 ${
        isPrimary
          ? "border-cyan-300/35 shadow-[0_0_0_1px_rgba(103,232,249,0.14),0_14px_38px_rgba(34,211,238,0.13)]"
          : "border-white/10"
      } bg-[linear-gradient(165deg,rgba(12,20,40,0.92),rgba(8,14,30,0.9)_55%,rgba(6,12,26,0.9))] hover:-translate-y-1.5 hover:border-cyan-300/45 hover:shadow-[0_20px_48px_rgba(34,211,238,0.16)]`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-[14px] font-extrabold leading-6 text-white sm:text-[15px]">
          {item.title}
          <span className="mx-2 text-white/35">·</span>
          <span className="font-extrabold text-cyan-300">{item.company}</span>
        </h3>
        <p className="shrink-0 pt-0.5 text-[11px] font-bold tracking-wide text-white/50 sm:text-[12px]">
          {item.date}
        </p>
      </div>

      <p className="mt-6 max-w-[610px] text-[13px] font-medium leading-7 text-white/78 sm:text-[14px]">
        {item.description}
      </p>

      {item.tags?.length ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {item.tags.map((tag) => (
            <SkillTag key={tag}>{tag}</SkillTag>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function TimelineItem() {
  const [step, setStep] = useState(-1);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!inView) return;
    setStep(0);
  }, [inView]);

  useEffect(() => {
    if (step < 0 || step >= experiences.length - 1) return;
    const timer = window.setTimeout(() => {
      setStep((current) => Math.min(current + 1, experiences.length - 1));
    }, 900);
    return () => window.clearTimeout(timer);
  }, [step]);

  return (
    <div ref={sectionRef}>
      <div className="mx-auto mt-10 max-w-[780px] sm:mt-14">
        {experiences.map((timelineItem, index) => {
          const isVisible = step >= index;
          const isSegmentActive = step === index && index < experiences.length - 1;
          const isItemLast = index === experiences.length - 1;

          return (
            <div
              key={`${timelineItem.title}-${timelineItem.company}`}
              className="relative grid grid-cols-[48px_minmax(0,1fr)] gap-3 sm:grid-cols-[62px_minmax(0,1fr)] sm:gap-5"
            >
              {!isItemLast ? (
                <span className="absolute left-[23px] top-11 h-[calc(100%+30px)] w-px bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(103,232,249,0.35),rgba(255,255,255,0.04))] sm:left-[30px]">
                  <motion.span
                    className="absolute left-0 top-0 block w-[2px] bg-cyan-200 shadow-[0_0_20px_rgba(103,232,249,1),0_0_36px_rgba(34,211,238,0.95),0_0_54px_rgba(34,211,238,0.8)]"
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      isSegmentActive
                        ? { height: "100%", opacity: [0.4, 1, 0.28] }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.72, ease: "easeInOut" }}
                  />
                </span>
              ) : null}

              <motion.div
                className="relative z-10 flex justify-center pt-1"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                <div className="h-11 w-11 rounded-full border border-white/20 bg-[#081124] shadow-[0_8px_20px_rgba(0,0,0,0.28)] ring-4 ring-[#020817] sm:h-12 sm:w-12">
                  <LogoMarker type={timelineItem.logo} />
                </div>
              </motion.div>

              <motion.div
                className="pb-8 sm:pb-9"
                initial={{ opacity: 0, x: 24 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
                transition={{
                  duration: 0.38,
                  ease: "easeOut",
                  delay: isVisible && index > 0 ? 0.12 : 0,
                }}
              >
                <ExperienceCard item={timelineItem} isPrimary={index === 0} />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="bg-transparent px-5 pb-16 pt-6 text-white sm:px-8 sm:pb-20 sm:pt-10 lg:pb-24 lg:pt-12"
    >
      <div className="mx-auto max-w-[920px]">
        <div className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.42em] text-white/40">
            WHERE I&apos;VE WORKED
          </p>
          <h2 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.055em] text-white sm:text-[56px] md:text-[64px]">
            Experience
          </h2>
        </div>

        <TimelineItem />
      </div>
    </section>
  );
}
