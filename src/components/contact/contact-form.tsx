"use client";

import { useState } from "react";

import { useUI } from "@/context/ui-context";
import { CONFIG } from "@/lib/data";
import { cn } from "@/lib/utils";

const TOPICS = ["A booking", "Group or long stay", "Extra services", "Something else"] as const;

const line =
  "w-full border-0 border-b border-stone-300 bg-transparent px-0 pb-2.5 pt-1 text-[17px] text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-brand";

// TODO: post enquiries to an API route that emails CONFIG.email once email sending is set up.
export function ContactForm() {
  const { toast } = useUI();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !note.trim()) {
      toast("warn", "Almost there", "Add your name, email, and a short message.");
      return;
    }
    const subject = `${topic} — enquiry from ${name.trim()}`;
    const body = `${note.trim()}\n\n${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast("ok", "Opening your email app", `Your message is addressed to ${CONFIG.email}.`);
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-9">
      <fieldset>
        <legend className="text-[11.5px] font-semibold uppercase tracking-[.16em] text-stone-500">I&apos;m asking about</legend>
        <div className="mt-3.5 flex flex-wrap gap-2 mportrait:justify-center">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={cn(
                "rounded-full border px-4 py-2 text-[14px] transition-colors",
                topic === t ? "border-brand bg-brand text-stone-50" : "border-stone-300 text-stone-700 hover:border-stone-900",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-9 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.16em] text-stone-500">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jane Doe" className={line} />
        </label>
        <label className="grid gap-1">
          <span className="text-[11.5px] font-semibold uppercase tracking-[.16em] text-stone-500">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="jane@email.com"
            className={line}
          />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-[11.5px] font-semibold uppercase tracking-[.16em] text-stone-500">Message</span>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Dates, number of guests, anything we should know…"
          className={cn(line, "resize-none")}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p data-m-center className="text-[13px] text-stone-500 mportrait:w-full">We usually reply within a few hours.</p>
        <button
          type="submit"
          data-m-btn
          className="group inline-flex h-14 items-center gap-3 bg-brand px-8 text-[14px] font-semibold uppercase tracking-[.14em] text-stone-50 transition-colors hover:bg-brand-hover"
        >
          Send message
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
