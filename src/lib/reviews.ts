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

/** Approved reviews for one space, newest first. Empty when the database isn't connected. */
export async function fetchReviews(apartmentId: string): Promise<Review[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return [];
  const { data } = await sb
    .from("reviews")
    .select(COLUMNS)
    .eq("apartment_id", apartmentId)
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data as Review[] | null) ?? [];
}

/** Saves a review for approval. Returns false when the database isn't connected or the insert fails. */
export async function submitReview(draft: ReviewDraft): Promise<boolean> {
  const sb = getSupabaseBrowser();
  if (!sb) return false;
  const { error } = await sb.from("reviews").insert({ ...draft, name: draft.name.trim(), body: draft.body.trim() });
  return !error;
}

/** Reviews waiting for approval (admins only; RLS returns nothing to anyone else). */
export async function fetchPendingReviews(): Promise<Review[]> {
  const sb = getSupabaseBrowser();
  if (!sb) return [];
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
  if (!sb) return false;
  const { error } = await sb.from("reviews").delete().eq("id", id);
  return !error;
}

export function stars(n: number) {
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}
