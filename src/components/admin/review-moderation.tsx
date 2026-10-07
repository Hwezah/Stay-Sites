"use client";

import { useEffect, useState } from "react";

import { useUI } from "@/context/ui-context";
import { APARTMENTS } from "@/lib/data";
import { approveReview, deleteReview, fetchPendingReviews, stars, type Review } from "@/lib/reviews";
import { supabaseEnabled } from "@/lib/supabase/config";

/** Guest reviews waiting for approval. Approved ones go live on the space's page. */
export function ReviewModeration() {
  const { toast } = useUI();
  const [pending, setPending] = useState<Review[] | null>(null);

  useEffect(() => {
    if (!supabaseEnabled) return;
    fetchPendingReviews().then(setPending);
  }, []);

  if (!supabaseEnabled) return null;

  const act = async (r: Review, approve: boolean) => {
    const ok = approve ? await approveReview(r.id) : await deleteReview(r.id);
    if (!ok) return toast("warn", "That didn't save", "Check your connection and try again.");
    setPending((p) => p?.filter((x) => x.id !== r.id) ?? null);
    toast("ok", approve ? "Review published" : "Review deleted", approve ? `It now shows on the ${spaceName(r)} page.` : "");
  };

  return (
    <section className="mt-12">
      <div data-m-center className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-display text-[clamp(22px,3.6vw,32px)] font-medium">Guest reviews</h2>
        <div className="text-[12.5px] text-stone-500">{pending?.length ?? 0} waiting</div>
      </div>
      <div className="mt-4 grid gap-3">
        {pending?.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white px-5 py-7 text-center text-[14.5px] text-stone-500">
            No reviews waiting for approval.
          </div>
        )}
        {pending?.map((r) => (
          <div key={r.id} className="grid gap-3 rounded-lg border border-stone-200 bg-white px-[clamp(13px,3.2vw,20px)] py-[clamp(13px,3.2vw,18px)]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="tracking-[.15em] text-brass" aria-label={`${r.rating} out of 5 stars`}>
                {stars(r.rating)}
              </span>
              <span className="font-semibold">{r.name}</span>
              <span className="text-stone-500">
                {spaceName(r)} · {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            </div>
            <p className="text-[14.5px] leading-[1.6] whitespace-pre-line text-stone-700">{r.body}</p>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => act(r, true)}
                className="h-10 rounded-[10px] bg-brand px-[18px] text-[13.5px] font-medium text-stone-50 hover:bg-brand-hover"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => act(r, false)}
                className="h-10 rounded-[10px] border border-stone-300 px-[18px] text-[13.5px] font-medium text-stone-700 hover:border-stone-900"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function spaceName(r: Review) {
  return APARTMENTS.find((a) => a.id === r.apartment_id)?.name ?? r.apartment_id;
}
