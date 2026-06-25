"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

/** Minimal typings for the Square Web Payments SDK we use. */
type SquareCard = {
  attach: (selector: string | HTMLElement) => Promise<void>;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
  destroy?: () => Promise<void>;
};
type SquarePayments = { card: () => Promise<SquareCard> };
type SquareSdk = { payments: (appId: string, locationId: string) => SquarePayments };

declare global {
  interface Window {
    Square?: SquareSdk;
  }
}

export type CardFormHandle = {
  /** Returns a payment token, or null if tokenization failed. */
  tokenize: () => Promise<string | null>;
};

const SDK_URLS = {
  sandbox: "https://sandbox.web.squarecdn.com/v1/square.js",
  production: "https://web.squarecdn.com/v1/square.js",
};

function loadSquareSdk(env: "sandbox" | "production"): Promise<SquareSdk> {
  if (window.Square) return Promise.resolve(window.Square);
  const src = SDK_URLS[env];
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Square!));
      existing.addEventListener("error", () => reject(new Error("Square SDK failed to load")));
      if (window.Square) resolve(window.Square);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => (window.Square ? resolve(window.Square) : reject(new Error("Square SDK missing")));
    script.onerror = () => reject(new Error("Square SDK failed to load"));
    document.head.appendChild(script);
  });
}

export const CardForm = forwardRef<CardFormHandle, { onError?: (msg: string) => void }>(
  function CardForm({ onError }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<SquareCard | null>(null);
    const [ready, setReady] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
      let cancelled = false;
      const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
      const env =
        process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
          ? "production"
          : "sandbox";

      if (!appId || !locationId) {
        setLoadError("Payment configuration is missing.");
        return;
      }

      (async () => {
        try {
          const sdk = await loadSquareSdk(env);
          if (cancelled) return;
          const payments = sdk.payments(appId, locationId);
          const card = await payments.card();
          if (cancelled) return;
          await card.attach(containerRef.current!);
          cardRef.current = card;
          setReady(true);
        } catch (e) {
          if (!cancelled) setLoadError(e instanceof Error ? e.message : "Card failed to load");
        }
      })();

      return () => {
        cancelled = true;
        cardRef.current?.destroy?.().catch(() => {});
        cardRef.current = null;
      };
    }, []);

    useImperativeHandle(ref, () => ({
      async tokenize() {
        if (!cardRef.current) {
          onError?.("Card field is not ready yet.");
          return null;
        }
        const result = await cardRef.current.tokenize();
        if (result.status === "OK" && result.token) return result.token;
        const msg = result.errors?.[0]?.message ?? "Please check your card details.";
        onError?.(msg);
        return null;
      },
    }));

    return (
      <div>
        <div ref={containerRef} className="min-h-[44px] p-1" />
        {!ready && !loadError && (
          <p className="px-1 pb-1 text-xs text-muted-foreground">Loading secure card field…</p>
        )}
        {loadError && <p className="px-1 pb-1 text-xs text-red-700">{loadError}</p>}
      </div>
    );
  },
);
