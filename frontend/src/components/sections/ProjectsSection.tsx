"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { projects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { useLanguage } from "@/components/LanguageProvider";

type Project = (typeof projects)[number];

export default function ProjectsSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id="projects" className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title">{t("projectsKicker")}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{t("projectsTitle")}</h2>
          </div>
          <span className="hidden text-sm text-white/60 md:block">{t("projectsCount")}</span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <ProjectCard project={project} onOpen={setActive} />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <AnimatePresence>
        {active ? <ProjectModal project={active} onClose={() => setActive(null)} /> : null}
      </AnimatePresence>
    </section>
  );
}
