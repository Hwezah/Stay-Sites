"use client";

import Image from "next/image";
import { useState, type FormEvent, type ReactNode } from "react";

import { Field, TextInput } from "@/components/site/field";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUI } from "@/context/ui-context";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { SITE } from "@site";

export type AuthMode = "signin" | "signup" | "forgot" | "reset" | "check-email";

type Problem = { text: string; action?: { label: string; run: () => void } };
type EmailStatus = "none" | "oauth" | "unconfirmed" | "password";

const COPY: Record<AuthMode, { title: string; sub: string }> = {
  signin: { title: "Welcome back", sub: "Sign in to keep your trips and receipts in one place." },
  signup: { title: "Create your account", sub: "Save your bookings and check out faster next time." },
  forgot: { title: "Reset your password", sub: "Enter your email and we'll send you a link to set a new one." },
  reset: { title: "Set a new password", sub: "Choose a password with at least 8 characters." },
  "check-email": { title: "Check your email", sub: "" },
};

function friendly(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "An account with this email already exists. Sign in instead.";
  if (m.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the link.";
  if (m.includes("password should be")) return "Please use a longer password (at least 8 characters).";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a minute and try again.";
  return message;
}

export function AuthDialog({
  open,
  mode,
  next,
  onModeChange,
  onOpenChange,
  onSignedIn,
}: {
  open: boolean;
  mode: AuthMode;
  next: string;
  onModeChange: (mode: AuthMode) => void;
  onOpenChange: (open: boolean) => void;
  onSignedIn: () => void;
}) {
  const { toast } = useUI();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<null | "form" | "google">(null);
  const [error, setError] = useState<Problem | null>(null);
  const [sentTo, setSentTo] = useState<{ email: string; reason: "confirm" | "reset" } | null>(null);

  const switchMode = (m: AuthMode) => {
    setError(null);
    setPassword("");
    onModeChange(m);
  };

  const callback = (to: string) =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(to)}`;

  const google = async () => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setBusy("google");
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback(next) } });
    if (error) {
      setError({ text: friendly(error.message) });
      setBusy(null);
    }
    // On success the browser leaves for Google, so keep the spinner.
  };

  /**
   * Supabase gives the same "invalid login credentials" for a wrong password and for an email with no account.
   * Ask the auth_email_status function (supabase/migrations) which it is. If the function isn't installed,
   * fall back to the generic message.
   */
  const explainFailedSignIn = async (address: string): Promise<Problem> => {
    const supabase = getSupabaseBrowser();
    const { data, error } = supabase
      ? await supabase.rpc("auth_email_status", { p_email: address })
      : { data: null, error: true };
    const status = (error ? null : data) as EmailStatus | null;
    if (status === "none")
      return {
        text: `There's no ${SITE.name} account for ${address} yet.`,
        action: { label: "Create an account", run: () => switchMode("signup") },
      };
    if (status === "oauth")
      return { text: "This email signs in with Google. Use \u201cContinue with Google\u201d above." };
    if (status === "unconfirmed")
      return {
        text: "This account isn't confirmed yet. Open the link we emailed you, then sign in.",
        action: { label: "Resend the link", run: () => resendConfirmation(address) },
      };
    if (status === "password")
      return {
        text: "That password isn't right for this account.",
        action: { label: "Reset your password", run: () => switchMode("forgot") },
      };
    return { text: friendly("invalid login credentials") };
  };

  const resendConfirmation = async (address: string) => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: address,
      options: { emailRedirectTo: callback(next) },
    });
    if (error) {
      setError({ text: friendly(error.message) });
      return;
    }
    setSentTo({ email: address, reason: "confirm" });
    onModeChange("check-email");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    setError(null);
    if ((mode === "signup" || mode === "reset") && password.length < 8) {
      setError({ text: "Please use a password with at least 8 characters." });
      return;
    }
    setBusy("form");
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          if (error.message.toLowerCase().includes("invalid login credentials")) {
            setError(await explainFailedSignIn(email.trim()));
            return;
          }
          throw error;
        }
        toast("ok", "Signed in", `Welcome back to ${SITE.name}.`);
        onSignedIn();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() }, emailRedirectTo: callback(next) },
        });
        if (error) throw error;
        // Supabase hides "already registered" behind a user with no identities.
        if (data.user && data.user.identities?.length === 0) throw new Error("already registered");
        if (data.session) {
          toast("ok", "Account created", `Welcome, ${name.trim().split(" ")[0] || "friend"}.`);
          onSignedIn();
        } else {
          setSentTo({ email: email.trim(), reason: "confirm" });
          onModeChange("check-email");
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: callback("/?auth=reset"),
        });
        if (error) throw error;
        setSentTo({ email: email.trim(), reason: "reset" });
        onModeChange("check-email");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        toast("ok", "Password updated", "You're signed in with your new password.");
        onSignedIn();
      }
    } catch (err) {
      setError({ text: friendly(err instanceof Error ? err.message : String(err)) });
    } finally {
      setBusy(null);
    }
  };

  const copy = COPY[mode];
  const showGoogle = mode === "signin" || mode === "signup";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 p-0"
        // Centred on the 26px logo row; nudged out so the ✕ itself lines up with the form edge.
        closeClassName="top-[calc(clamp(22px,5vw,28px)-14px)] right-[calc(clamp(20px,5vw,28px)-18px)]"
        onOpenAutoFocus={(e) => mode === "check-email" && e.preventDefault()}>
        <div className="px-[clamp(20px,5vw,28px)] pt-[clamp(22px,5vw,28px)]">
          <div className="flex items-center gap-[9px]">
            <Image src={SITE.logo} alt="" width={26} height={26} className="size-[26px] object-contain" />
            <span className="font-display text-[19px]">{SITE.wordmark}</span>
          </div>
          <DialogHeader className="mt-5">
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>
              {mode === "check-email" && sentTo
                ? sentTo.reason === "confirm"
                  ? `We sent a confirmation link to ${sentTo.email}. Open it to finish creating your account.`
                  : `If an account exists for ${sentTo.email}, a password reset link is on its way.`
                : copy.sub}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid gap-3.5 px-[clamp(20px,5vw,28px)] pt-5 pb-[clamp(20px,5vw,26px)]">
          {showGoogle && (
            <>
              <button
                type="button"
                onClick={google}
                disabled={busy !== null}
                className="flex h-[46px] items-center justify-center gap-2.5 rounded-md border border-stone-200 bg-white text-[14.5px] font-medium text-stone-900 transition-colors hover:bg-stone-50 disabled:opacity-60"
              >
                {busy === "google" ? <Spinner /> : <GoogleLogo />}
                Continue with Google
              </button>
              {/* Apple sign-in isn't set up yet; shown so guests know it's on the way. */}
              <button
                type="button"
                disabled
                aria-describedby="apple-soon"
                className="flex h-[46px] cursor-not-allowed items-center justify-center gap-2.5 rounded-md border border-stone-200 bg-stone-50 text-[14.5px] font-medium text-stone-400"
              >
                <AppleLogo />
                Continue with Apple
                <span
                  id="apple-soon"
                  className="rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[.08em] text-brand"
                >
                  Coming soon
                </span>
              </button>
              <div className="flex items-center gap-3 text-[11.5px] text-stone-400">
                <span className="h-px flex-1 bg-stone-100" />
                or with email
                <span className="h-px flex-1 bg-stone-100" />
              </div>
            </>
          )}

          {mode === "check-email" ? (
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="h-[46px] rounded-md bg-brand text-[15px] font-medium text-stone-50 hover:bg-brand-hover"
            >
              Back to sign in
            </button>
          ) : (
            <form onSubmit={submit} className="grid gap-3.5" noValidate>
              {mode === "signup" && (
                <Field label="Full name">
                  <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" required />
                </Field>
              )}
              {mode !== "reset" && (
                <Field label="Email">
                  <TextInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </Field>
              )}
              {mode !== "forgot" && (
                <Field
                  label={
                    <span className="flex w-full items-center justify-between">
                      {mode === "reset" ? "New password" : "Password"}
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-[12.5px] font-normal text-brand hover:text-brand-hover"
                        >
                          Forgot password?
                        </button>
                      )}
                    </span>
                  }
                >
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </Field>
              )}

              {error && (
                <div role="alert" className="rounded-[10px] bg-red-50 px-3 py-2.5 text-[13px] leading-[1.45] text-red-700">
                  {error.text}
                  {error.action && (
                    <>
                      {" "}
                      <button type="button" onClick={error.action.run} className="font-medium underline underline-offset-2 hover:text-red-900">
                        {error.action.label}
                      </button>
                    </>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={busy !== null}
                className="flex h-[46px] items-center justify-center gap-2 rounded-md bg-brand text-[15px] font-medium text-stone-50 hover:bg-brand-hover disabled:opacity-70"
              >
                {busy === "form" && <Spinner />}
                {{ signin: "Sign in", signup: "Create account", forgot: "Send reset link", reset: "Update password" }[mode]}
              </button>
            </form>
          )}

          <FooterSwitch mode={mode} onSwitch={switchMode} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FooterSwitch({ mode, onSwitch }: { mode: AuthMode; onSwitch: (m: AuthMode) => void }) {
  const link = (label: string, to: AuthMode): ReactNode => (
    <button type="button" onClick={() => onSwitch(to)} className="font-medium text-brand hover:text-brand-hover">
      {label}
    </button>
  );
  const text =
    mode === "signin" ? (
      <>New here? {link("Create an account", "signup")}</>
    ) : mode === "signup" ? (
      <>Already have an account? {link("Sign in", "signin")}</>
    ) : mode === "forgot" ? (
      <>Remembered it? {link("Back to sign in", "signin")}</>
    ) : null;
  return text ? <p className="text-center text-[13px] text-stone-500">{text}</p> : null;
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <TextInput
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        autoComplete={autoComplete}
        className="pr-16"
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-2 py-1 text-[12px] font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-900"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.62c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.87 2.3 1.15-.05 1.59-.75 2.98-.75 1.39 0 1.78.75 3 .72 1.24-.02 2.03-1.12 2.78-2.23.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.42-.93-2.44-3.66zM14.1 5.86c.63-.77 1.06-1.84.94-2.9-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.27z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
