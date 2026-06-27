"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

export type CartModifier = { id: string; name: string; priceCents: number };

export type CartLine = {
  /** Stable key for this exact item+variation+modifier configuration. */
  key: string;
  itemId: string;
  itemName: string;
  variationId: string;
  variationName: string;
  basePriceCents: number;
  modifiers: CartModifier[];
  quantity: number;
  /** Product image for the cart/checkout thumbnail. */
  imageUrl?: string;
};

/** A line ready to add — quantity and key are derived by the reducer. */
export type NewCartLine = Omit<CartLine, "key" | "quantity">;

export function lineUnitPrice(line: Pick<CartLine, "basePriceCents" | "modifiers">): number {
  return line.basePriceCents + line.modifiers.reduce((sum, m) => sum + m.priceCents, 0);
}

/** Identical configurations share a key so quantities stack instead of duplicating. */
function makeKey(line: NewCartLine): string {
  const mods = line.modifiers
    .map((m) => m.id)
    .sort()
    .join(",");
  return `${line.itemId}|${line.variationId}|${mods}`;
}

type Action =
  | { type: "add"; line: NewCartLine; quantity: number }
  | { type: "setQty"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const key = makeKey(action.line);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) =>
          l.key === key ? { ...l, quantity: l.quantity + action.quantity } : l,
        );
      }
      return [...state, { ...action.line, key, quantity: action.quantity }];
    }
    case "setQty":
      return state
        .map((l) => (l.key === action.key ? { ...l, quantity: action.quantity } : l))
        .filter((l) => l.quantity > 0);
    case "remove":
      return state.filter((l) => l.key !== action.key);
    case "clear":
      return [];
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  addLine: (line: NewCartLine, quantity?: number) => void;
  setQty: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load persisted cart once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be unavailable */
    }
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalCents = lines.reduce(
      (sum, l) => sum + lineUnitPrice(l) * l.quantity,
      0,
    );
    return {
      lines,
      count,
      subtotalCents,
      addLine: (line, quantity = 1) => dispatch({ type: "add", line, quantity }),
      setQty: (key, quantity) => dispatch({ type: "setQty", key, quantity }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    };
  }, [lines, drawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
