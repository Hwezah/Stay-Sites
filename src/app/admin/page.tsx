import type { Metadata } from "next";

import { AdminConsole } from "@/components/admin/admin-console";
import { supabaseEnabled } from "@/lib/supabase/config";
import { getCurrentUser, userIsAdmin } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin console", robots: { index: false } };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (userIsAdmin(user)) return <AdminConsole />;

  return (
    <main data-m-center className="mx-auto w-full max-w-[720px] px-[clamp(16px,4vw,24px)] pt-[clamp(40px,7vw,72px)] pb-[120px]">
      <h1 className="font-display text-[clamp(26px,4.8vw,46px)] tracking-[-.02em] font-medium">
        {supabaseEnabled ? "Admins only" : "Admin console"}
      </h1>
      <p className="mt-3 text-base leading-[1.6] text-stone-600">
        {supabaseEnabled
          ? "Your account doesn't have access to the admin console. Ask the owner to give your account the admin role."
          : "Admin sign-in is coming soon. Until then, bookings arrive by WhatsApp and phone."}
      </p>
    </main>
  );
}
