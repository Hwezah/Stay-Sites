import { getSupabaseBrowser } from "@/lib/supabase/client";

export type Review = {
  id: string;
  apartment_id: string;
  name: string;
  rating: number;
  body: string;
  approved: boolean;
  created_at: string;
};

export type ReviewDraft = Pick<Review, "apartment_id" | "name" | "rating" | "body">;

const COLUMNS = "id, apartment_id, name, rating, body, approved, created_at";

/*
 * Until Supabase is connected, reviews live in this browser's storage (like orders): they show straight
 * away on this device only, and the admin console can delete them. Connecting Supabase switches to the
 * shared table, where reviews wait for an admin to publish them.
 */
const LOCAL_KEY = "stay.reviews";

function readLocal(): Review[] {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) ?? "[]") as Review[];
  } catch {
    return [];
  }
}

function writeLocal(list: Review[]) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(0, 200)));
  } catch {
    // Storage full or blocked: the review just won't persist.
  }
}

/** Approved reviews for one space, newest first. */
export async function fetchReviews(apartmentId: string): Promise<Review[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return readLocal().filter((r) => r.apartment_id === apartmentId);
  const { data } = await sb
    .from("reviews")
    .select(COLUMNS)
    .eq("apartment_id", apartmentId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data as Review[] | null) ?? [];
}

/** Saves a review: for approval in the database, or straight to this browser without one. */
export async function submitReview(draft: ReviewDraft): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) {
    const review: Review = {
      ...draft,
      name: draft.name.trim(),
      body: draft.body.trim(),
      id: crypto.randomUUID(),
      approved: true,
      created_at: new Date().toISOString(),
    };
    writeLocal([review, ...readLocal()]);
    return true;
  }
  const { error } = await sb.from("reviews").insert({ ...draft, name: draft.name.trim(), body: draft.body.trim() });
  return !error;
}

/** Reviews waiting for approval (admins only; RLS returns nothing to anyone else), or this browser's reviews. */
export async function fetchPendingReviews(): Promise<Review[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return readLocal();
  const { data } = await sb.from("reviews").select(COLUMNS).eq("approved", false).order("created_at");
  return (data as Review[] | null) ?? [];
}

export async function approveReview(id: string): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) return false;
  const { error } = await sb.from("reviews").update({ approved: true }).eq("id", id);
  return !error;
}

export async function deleteReview(id: string): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) {
    writeLocal(readLocal().filter((r) => r.id !== id));
    return true;
  }
  const { error } = await sb.from("reviews").delete().eq("id", id);
  return !error;
}

export function stars(n: number) {
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}
