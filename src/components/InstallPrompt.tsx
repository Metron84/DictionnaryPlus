"use client";

import { useState, useEffect } from "react";

const DISMISS_KEY = "billies-dictionary-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const wasDismissed = localStorage.getItem(DISMISS_KEY);
    if (wasDismissed) return;

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setDismissed(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  };

  if (dismissed || !deferredPrompt) return null;

  return (
    <div
      className="no-print flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule)] bg-[var(--rule-light)] px-4 py-2 font-body text-[0.9rem] text-[var(--ink)]"
      role="banner"
    >
      <span>Add Billie&apos;s Dictionary to your home screen for quick access.</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded border border-[var(--blue-accent)] bg-[var(--blue-accent)] px-3 py-1.5 text-white hover:bg-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
        >
          Install
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-[var(--ink-faint)] underline decoration-dotted hover:text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-accent)] focus:ring-offset-2"
          aria-label="Dismiss"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
