import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

const control =
  "w-full min-w-0 rounded-[10px] border border-stone-200 bg-white px-3 text-sm outline-none transition-shadow focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,20,40,.2)]";

export function Field({ label, className, children }: { label: ReactNode; className?: string; children: ReactNode }) {
  return (
    <label className={cn("grid min-w-0 gap-1.5", className)}>
      <span className="text-[12.5px] font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-[42px]", className)} {...props} />;
}

export function TextArea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "resize-y py-2.5 font-sans", className)} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-lg border border-stone-200 bg-white p-[clamp(13px,3.2vw,24px)]", className)} {...props} />;
}
