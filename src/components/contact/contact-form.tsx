"use client";

import { useState } from "react";

import { Field, TextArea, TextInput } from "@/components/site/field";
import { useUI } from "@/context/ui-context";
import { CONFIG } from "@/lib/data";

// TODO: post enquiries to an API route that emails CONFIG.email once email sending is set up.
export function ContactForm() {
  const { toast } = useUI();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!name.trim() || !email.trim() || !note.trim()) {
      toast("warn", "Almost there", "Add your name, email, and a short message.");
      return;
    }
    const subject = `Enquiry from ${name.trim()}`;
    const body = `${note.trim()}\n\n${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast("ok", "Opening your email app", `Your message is addressed to ${CONFIG.email}.`);
  };

  return (
    <div className="min-w-0 flex-[1.5_1_340px] rounded-[8px] border border-stone-200 bg-white p-[clamp(14px,3.4vw,28px)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-4">
        <Field label="Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoComplete="email"
          />
        </Field>
        <Field label="Your message" className="col-span-full">
          <TextArea
            rows={7}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Email us today for any enquiries regarding your stay, and we'll be happy to assist you."
          />
        </Field>
      </div>
      <button
        type="button"
        onClick={submit}
        className="mt-5 min-h-12 w-full rounded-md bg-brand px-[26px] text-[15px] font-medium text-stone-50 hover:bg-brand-hover"
      >
        Submit
      </button>
    </div>
  );
}
