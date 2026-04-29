"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/5 px-6 py-10 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/60 md:flex-row">
        <span>{t("footerRights")}</span>
        <div className="flex gap-4">
          <a href="https://github.com" className="hover:text-white">
            GitHub
          </a>
          <a href="https://www.linkedin.com" className="hover:text-white">
            LinkedIn
          </a>
          <a href="mailto:hello@doan.tech" className="hover:text-white">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
