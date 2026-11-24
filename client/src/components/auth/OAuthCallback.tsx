"use client";

import { Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
// import { Logo } from "@/components/ui/logo";

// ─── Shared loading UI ───────────────────────────────────────────────────────

export function OAuthLoadingCard({ provider }: { provider: "github" | "google" }) {
    const providerLabel = provider === "github" ? "GitHub" : "Google";

    useEffect(() => {
        console.log("HTML theme:", document.documentElement.className);
        console.log("Stored theme:", localStorage.getItem("theme"));
        console.log(
            "System preference:",
            window.matchMedia("(prefers-color-scheme: dark)").matches
        );
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-6">

            {/* Soft radial glow behind the card */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
                <div className="size-[500px] rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative flex w-full max-w-sm flex-col items-center gap-8">

                {/* Logo */}
                {/* <Logo className="h-8 w-auto" /> */}

                {/* Card */}
                <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm">

                    {/* Spinner */}
                    <div className="relative flex size-16 items-center justify-center rounded-2xl border border-border bg-muted shadow-sm">
                        <Loader2 className="size-7 animate-spin text-primary" strokeWidth={1.5} />
                    </div>

                    {/* Copy */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-lg font-bold tracking-tight text-foreground">
                            Signing you in
                        </h1>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Verifying your {providerLabel} account.
                            <br />
                            This only takes a moment…
                        </p>
                    </div>

                    {/* Progress dots */}
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="size-1.5 rounded-full bg-primary opacity-0"
                                style={{
                                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom hint */}
                <p className="text-xs text-muted-foreground">
                    Redirecting you to your dashboard once verified.
                </p>
            </div>

            {/* Keyframe for the pulsing dots */}
            <style>{`
        @keyframes pulse-dot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
        </div>
    );
}

// ─── Fallback (Suspense boundary) ────────────────────────────────────────────

export function OAuthFallback() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-8 animate-spin text-primary" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Loading…</p>
            </div>
        </div>
    );
}

// ─── GitHub callback ──────────────────────────────────────────────────────────

export function GithubAuthContent() {
    // your existing hook/logic here — just replace the return
    return <OAuthLoadingCard provider="github" />;
}

export function GithubAuth() {
    return (
        <Suspense fallback={<OAuthFallback />}>
            <GithubAuthContent />
        </Suspense>
    );
}

