"use client";

import { useEffect, useState } from "react";

import { FieldLabel } from "@/components/site/ui";
import { useUI } from "@/context/ui-context";
import { whatsappUrl } from "@/lib/booking";
import { fetchReviews, stars, submitReview, type Review } from "@/lib/reviews";
import { supabaseEnabled } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";
import { SITE } from "@site";

type Sample = { quote: string; who: string };

/**
 * Reviews for one space, plus a form for guests to leave their own. With the database connected a review
 * is saved and appears once an admin approves it; without it, the review goes to the host on WhatsApp.
 * The sample reviews only show until the first real one is approved.
 */
export function RoomReviews({ apartmentId, apartmentName, samples }: { apartmentId: string; apartmentName: string; samples: Sample[] }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [writing, setWriting] = useState(false);

  useEffect(() => {
    let live = true;
    fetchReviews(apartmentId).then((r) => live && setReviews(r));
    return () => {
      live = false;
    };
  }, [apartmentId]);

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mt-4">
      {reviews.length > 0 && (
        <p data-m-center className="text-[14px] text-stone-500">
          <span className="text-brass" aria-hidden="true">
            ★
          </span>{" "}
          {average.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
      )}

      <div className="mt-2 grid gap-6">
        {reviews.length > 0
          ? reviews.map((r) => (
              <figure key={r.id} className="border-b border-stone-200 pb-6 mportrait:text-center">
                <div className="text-[15px] tracking-[.2em] text-brass" aria-label={`${r.rating} out of 5 stars`}>
                  {stars(r.rating)}
                </div>
                <blockquote className="mt-2 text-[15px] leading-[1.7] whitespace-pre-line text-stone-700">“{r.body}”</blockquote>
                <figcaption className="mt-2 text-[13.5px] font-medium text-stone-500">
                  {r.name} · {new Date(r.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </figcaption>
              </figure>
            ))
          : samples.map((r) => (
              <figure key={r.who} className="border-b border-stone-200 pb-6 mportrait:text-center">
                <div className="text-[15px] tracking-[.2em] text-brass" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <blockquote className="mt-2 text-[15px] leading-[1.7] text-stone-700">“{r.quote}”</blockquote>
                <figcaption className="mt-2 text-[13.5px] font-medium text-stone-500">{r.who}</figcaption>
              </figure>
            ))}
      </div>

      {writing ? (
        <ReviewForm apartmentId={apartmentId} apartmentName={apartmentName} onDone={() => setWriting(false)} />
      ) : (
        <button
          type="button"
          data-m-btn
          onClick={() => setWriting(true)}
          className="mt-6 flex h-12 w-fit items-center justify-center border border-stone-900 px-6 text-[14.5px] font-medium text-stone-900 hover:bg-stone-900 hover:text-stone-50"
        >
          Write a review
        </button>
      )}
    </div>
  );
}

function ReviewForm({ apartmentId, apartmentName, onDone }: { apartmentId: string; apartmentName: string; onDone: () => void }) {
  const { toast } = useUI();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast("warn", "Pick a star rating", "Tap a star from 1 to 5.");
    if (!name.trim()) return toast("warn", "Add your name", "Your first name is enough.");
    if (body.trim().length < 10) return toast("warn", "Tell us a little more", "A sentence or two about your stay.");

    if (!supabaseEnabled) {
      window.open(
        whatsappUrl([`Review for ${apartmentName}`, `${stars(rating)} (${rating}/5)`, body.trim(), `— ${name.trim()}`]),
        "_blank",
        "noopener",
      );
      toast("ok", "Opening WhatsApp", `Send the message and ${SITE.host.firstName} will add your review.`);
      onDone();
      return;
    }

    setSending(true);
    const ok = await submitReview({ apartment_id: apartmentId, name, rating, body });
    setSending(false);
    if (!ok) return toast("warn", "Couldn't send your review", "Please try again in a moment.");
    toast("ok", "Thank you for your review", "It will appear here once it has been checked.");
    onDone();
  };

  const shown = hover || rating;

  return (
    <form onSubmit={send} className="mt-6 grid gap-4 border border-stone-200 bg-white p-[clamp(16px,3vw,24px)]">
      <div className="font-display text-[22px] font-medium">Review {apartmentName}</div>

      <fieldset>
        <legend>
          <FieldLabel>Your rating</FieldLabel>
        </legend>
        <div className="mt-1.5 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className={cn(
                  "block px-0.5 text-[30px] leading-none transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                  n <= shown ? "text-brass" : "text-stone-300",
                )}
              >
                ★
              </span>
              <span className="sr-only">
                {n} {n === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-1.5">
        <FieldLabel>Your name</FieldLabel>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          autoComplete="given-name"
          className="h-11 border border-stone-300 bg-white px-3 text-[15px] outline-none focus:border-brand"
        />
      </label>

      <label className="grid gap-1.5">
        <FieldLabel>Your review</FieldLabel>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1200}
          rows={4}
          placeholder="What did you enjoy about your stay?"
          className="border border-stone-300 bg-white px-3 py-2.5 text-[15px] leading-[1.6] outline-none focus:border-brand"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={sending}
          className="h-12 flex-1 bg-brand px-6 text-[15px] font-medium text-stone-50 hover:bg-brand-hover disabled:opacity-60"
        >
          {sending ? "Sending…" : supabaseEnabled ? "Submit review" : "Send review on WhatsApp"}
        </button>
        <button type="button" onClick={onDone} className="h-12 px-4 text-[14.5px] text-stone-600 hover:text-stone-900">
          Cancel
        </button>
      </div>
    </form>
  );
}
