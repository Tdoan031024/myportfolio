"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <p className="section-title">{t("contactKicker")}</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white">{t("contactTitle")}</h2>
            <p className="mt-4 text-white/70">{t("contactDesc")}</p>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <p>Email: hello@doan.tech</p>
              <p>{t("contactLocation")}</p>
              <p>{t("contactOpen")}</p>
            </div>
          </div>
          <motion.form
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("formName")}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80 focus:border-cyan-400/60 focus:outline-none"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t("formEmail")}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80 focus:border-cyan-400/60 focus:outline-none"
                required
              />
            </div>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder={t("formSubject")}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80 focus:border-cyan-400/60 focus:outline-none"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={t("formMessage")}
              rows={4}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80 focus:border-cyan-400/60 focus:outline-none"
              required
            />
            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                disabled={status === "loading"}
                className="neon-ring rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                {status === "loading" ? t("formSending") : t("formSend")}
              </button>
              <div className="text-xs text-white/60">
                {status === "success" && t("formSuccess")}
                {status === "error" && t("formError")}
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
