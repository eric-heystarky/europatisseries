"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Pay + Apple Pay buttons via the Square Web Payments SDK.
 *
 * The wallet returns a payment token that is sent through the SAME server-side
 * `placeOrder` flow as a card — so no backend changes are needed.
 *
 * Requirements (these buttons are deliberately silent when unmet):
 *  - HTTPS (won't work on http://localhost).
 *  - Google Pay: a supporting browser/device (Chrome, Android) with a card.
 *  - Apple Pay: Safari/Apple device + the domain registered with Square.
 */

type TokenResult = {
  status: string;
  token?: string;
  errors?: Array<{ message: string }>;
};
type WalletMethod = {
  tokenize: () => Promise<TokenResult>;
  attach?: (selector: string | HTMLElement, options?: unknown) => Promise<void>;
  destroy?: () => Promise<void>;
};
type PaymentRequest = unknown;
type SquarePayments = {
  paymentRequest: (req: {
    countryCode: string;
    currencyCode: string;
    total: { amount: string; label: string };
  }) => PaymentRequest;
  googlePay: (req: PaymentRequest) => Promise<WalletMethod>;
  applePay: (req: PaymentRequest) => Promise<WalletMethod>;
};
type SquareSdk = { payments: (appId: string, locationId: string) => SquarePayments };

const SDK_URLS = {
  sandbox: "https://sandbox.web.squarecdn.com/v1/square.js",
  production: "https://web.squarecdn.com/v1/square.js",
};

function loadSquareSdk(env: "sandbox" | "production"): Promise<SquareSdk> {
  const w = window as unknown as { Square?: SquareSdk };
  if (w.Square) return Promise.resolve(w.Square);
  const src = SDK_URLS[env];
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => (w.Square ? resolve(w.Square) : reject(new Error("Square SDK missing"))));
      existing.addEventListener("error", () => reject(new Error("Square SDK failed to load")));
      if (w.Square) resolve(w.Square);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => (w.Square ? resolve(w.Square) : reject(new Error("Square SDK missing")));
    script.onerror = () => reject(new Error("Square SDK failed to load"));
    document.head.appendChild(script);
  });
}

type Props = {
  amountCents: number;
  currency: string;
  /** Run before opening the wallet sheet; return an error string to block, or null to proceed. */
  validate: () => string | null;
  /** Receives the payment token after a successful wallet authorization. */
  onToken: (token: string) => void | Promise<void>;
  onError: (msg: string) => void;
};

export function WalletButtons({ amountCents, currency, validate, onToken, onError }: Props) {
  const gpayRef = useRef<HTMLDivElement>(null);
  const applePayRef = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [appleReady, setAppleReady] = useState(false);

  // Keep latest callbacks in refs so the effect only re-runs on amount/currency.
  const cb = useRef({ validate, onToken, onError });
  cb.current = { validate, onToken, onError };

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];
    let googlePay: WalletMethod | null = null;
    let applePay: WalletMethod | null = null;

    const appId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
    const env = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";
    if (!appId || !locationId || amountCents <= 0) return;

    async function pay(method: WalletMethod) {
      const err = cb.current.validate();
      if (err) {
        cb.current.onError(err);
        return;
      }
      try {
        const result = await method.tokenize();
        if (result.status === "OK" && result.token) {
          await cb.current.onToken(result.token);
        } else if (result.status !== "Cancel") {
          cb.current.onError(result.errors?.[0]?.message ?? "Payment was not completed.");
        }
      } catch (e) {
        cb.current.onError(e instanceof Error ? e.message : "Wallet payment failed.");
      }
    }

    (async () => {
      try {
        const sdk = await loadSquareSdk(env);
        if (cancelled) return;
        const payments = sdk.payments(appId, locationId);
        const paymentRequest = payments.paymentRequest({
          countryCode: "AU",
          currencyCode: currency || "AUD",
          total: { amount: (amountCents / 100).toFixed(2), label: "Total" },
        });

        // ── Google Pay ──────────────────────────────────────────────
        try {
          googlePay = await payments.googlePay(paymentRequest);
          if (!cancelled && gpayRef.current) {
            await googlePay.attach?.(gpayRef.current, { buttonColor: "black", buttonSizeMode: "fill" });
            const handler = (e: Event) => {
              e.preventDefault();
              void pay(googlePay!);
            };
            gpayRef.current.addEventListener("click", handler);
            cleanups.push(() => gpayRef.current?.removeEventListener("click", handler));
            if (!cancelled) setGoogleReady(true);
          }
        } catch {
          /* Google Pay unsupported here — leave it hidden. */
        }

        // ── Apple Pay ───────────────────────────────────────────────
        try {
          applePay = await payments.applePay(paymentRequest);
          if (!cancelled && applePayRef.current) {
            const handler = (e: Event) => {
              e.preventDefault();
              void pay(applePay!);
            };
            applePayRef.current.addEventListener("click", handler);
            cleanups.push(() => applePayRef.current?.removeEventListener("click", handler));
            if (!cancelled) setAppleReady(true);
          }
        } catch {
          /* Apple Pay unsupported (not Safari / domain not registered) — hide it. */
        }
      } catch {
        /* SDK failed to load — wallets simply won't appear. */
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      googlePay?.destroy?.().catch(() => {});
      applePay?.destroy?.().catch(() => {});
    };
  }, [amountCents, currency]);

  // Nothing to show if neither wallet is available.
  const show = googleReady || appleReady;

  return (
    <div className={show ? "space-y-2" : "hidden"}>
      {/* Apple Pay button (its own styling, shown only in Safari). */}
      <div
        ref={applePayRef}
        className={appleReady ? "apple-pay-button apple-pay-button-black h-11 w-full cursor-pointer" : "hidden"}
        aria-label="Pay with Apple Pay"
        role="button"
      />
      {/* Google Pay button (rendered by Square into this div). */}
      <div ref={gpayRef} className={googleReady ? "min-h-11 w-full" : "hidden"} aria-label="Pay with Google Pay" />

      {show && (
        <div className="flex items-center gap-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or pay with card
          <span className="h-px flex-1 bg-border" />
        </div>
      )}
    </div>
  );
}
