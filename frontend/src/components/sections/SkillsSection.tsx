"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type SkillGroup = {
  id: string;
  title: string;
  label: string;
  accent: string;
  description: string;
  skills: string[];
  color: string;
  icon: ReactNode;
};

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    title: "Backend",
    label: "Server Logic",
    accent: "Node / PHP / .NET",
    color: "#22d3ee",
    description: "Build APIs, auth flows, admin systems and service logic for fullstack products.",
    skills: ["Node.js", "Express.js", "NestJS", "PHP", "Laravel", "ASP.NET MVC"],
    icon: <Icon><path d="M4 7h16M4 12h16M4 17h16" /><path d="M7 7v10M17 7v10" /></Icon>,
  },
  {
    id: "frontend",
    title: "Frontend",
    label: "UI Engineering",
    accent: "Web & Mobile",
    color: "#60a5fa",
    description: "Craft responsive interfaces, polished portfolio pages and mobile-ready UI.",
    skills: ["ReactJS", "Next.js", "Bootstrap", "Tailwind", "React Native"],
    icon: <Icon><path d="m8 9-4 3 4 3" /><path d="m16 9 4 3-4 3" /><path d="m14 5-4 14" /></Icon>,
  },
  {
    id: "database",
    title: "Database",
    label: "Data Layer",
    accent: "SQL & NoSQL",
    color: "#34d399",
    description: "Design data structures and connect applications with reliable storage services.",
    skills: ["SQL", "MySQL", "CouchDB", "MongoDB", "Firebase"],
    icon: <Icon><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></Icon>,
  },
  {
    id: "devops",
    title: "DevOps",
    label: "Delivery",
    accent: "Ship & Maintain",
    color: "#a78bfa",
    description: "Deploy projects, manage hosting environments and automate release workflows.",
    skills: ["Docker", "Host management", "Github Action"],
    icon: <Icon><path d="M6 16a4 4 0 0 1 0-8 5 5 0 0 1 9.7-1.5A4.5 4.5 0 1 1 18 16H6Z" /><path d="m9 13 2 2 4-5" /></Icon>,
  },
  {
    id: "api",
    title: "ORM & API",
    label: "Integration",
    accent: "Clean Access",
    color: "#f472b6",
    description: "Structure data access and REST communication with maintainable boundaries.",
    skills: ["Prisma", "Sequelize", "RESTful API"],
    icon: <Icon><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></Icon>,
  },
  {
    id: "tools",
    title: "Tools",
    label: "Workflow",
    accent: "Build Faster",
    color: "#facc15",
    description: "Debug, collaborate, test APIs and speed up development with practical tooling.",
    skills: ["Git", "Postman", "Laragon", "AI coding tools"],
    icon: <Icon><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-5.1 5.1a2 2 0 1 0 2.8 2.8l5.1-5.1a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.8-2.8 2.4-2.4Z" /></Icon>,
  },
];

const softSkills = ["Teamwork", "Communication", "Problem solving", "Self-learning", "Time management"];

export default function SkillsSection() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const active = useMemo(
    () => skillGroups.find((item) => item.id === activeId) ?? skillGroups[0],
    [activeId],
  );

  return (
    <section id="skills" className="px-6 py-20 md:px-16">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="section-title">{t("skillsKicker")}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-5xl">
              My Skills
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-white/58 md:text-right">
            A compact fullstack map: technical stack, delivery workflow, soft skills and English documentation reading.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[0.86fr_1.34fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between text-sm text-white/52">
              <span>Skill Navigator</span>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">
                Fullstack
              </span>
            </div>

            <div className="relative mx-auto my-7 flex aspect-square max-w-[300px] items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 26, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-1 rounded-full border border-dashed border-cyan-200/12"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute inset-12 rounded-full border border-white/10"
              />
              <div className="absolute inset-24 rounded-full bg-white/[0.035]" />

              {skillGroups.map((item, index) => {
                const positions = [
                  "left-1/2 top-0 -translate-x-1/2",
                  "right-2 top-[22%]",
                  "bottom-[16%] right-[6%]",
                  "bottom-0 left-1/2 -translate-x-1/2",
                  "bottom-[16%] left-[6%]",
                  "left-2 top-[22%]",
                ];
                const isActive = item.id === active.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setActiveId(item.id)}
                    onClick={() => setActiveId(item.id)}
                    aria-label={item.title}
                    className={`absolute ${positions[index]} grid h-13 w-13 place-items-center rounded-2xl border transition duration-300 md:h-14 md:w-14 ${
                      isActive
                        ? "scale-110 border-white/30 bg-white/[0.12] shadow-[0_0_35px_rgba(34,211,238,.18)]"
                        : "border-white/10 bg-white/[0.055] hover:-translate-y-1 hover:border-white/20"
                    }`}
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </button>
                );
              })}

              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.2 }}
                  className="grid h-28 w-28 place-items-center rounded-full border border-white/12 bg-[#071124cc] text-center shadow-[0_0_60px_rgba(34,211,238,.12)] backdrop-blur-xl"
                >
                  <div style={{ color: active.color }}>
                    <div className="mx-auto mb-1 grid h-8 w-8 place-items-center">{active.icon}</div>
                    <span className="text-sm font-semibold text-white">{active.title}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22 }}
                className="rounded-3xl border border-white/10 bg-black/15 p-5"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  {active.label}
                </span>
                <h3 className="mt-2 text-2xl font-semibold text-white">{active.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">{active.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {active.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-white/74">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {skillGroups.map((item, index) => {
                const isActive = active.id === item.id;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.42, delay: index * 0.04 }}
                    onMouseEnter={() => setActiveId(item.id)}
                    onClick={() => setActiveId(item.id)}
                    className={`group min-h-[138px] rounded-3xl border p-5 text-left backdrop-blur-xl transition duration-300 ${
                      isActive
                        ? "border-cyan-200/28 bg-cyan-300/[0.075]"
                        : "border-white/10 bg-white/[0.04] hover:-translate-y-1 hover:border-white/18 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">
                          {item.accent}
                        </span>
                        <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                      </div>
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.055]" style={{ color: item.color }}>
                        {item.icon}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/68">
                          {skill}
                        </span>
                      ))}
                      {item.skills.length > 3 && (
                        <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/68">
                          +{item.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.35fr_0.75fr]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  Soft Skills
                </span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {softSkills.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-white/72">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: 0.04 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/42">
                  Language
                </span>
                <h3 className="mt-3 text-xl font-semibold text-white">English Reading</h3>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  Read and understand technical documentation.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
