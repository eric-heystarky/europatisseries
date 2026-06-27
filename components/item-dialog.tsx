"use client";

import { useEffect, useMemo, useState } from "react";
import type { MenuItem, MenuModifierList } from "@/lib/menu";
import { formatPrice } from "@/lib/format";
import { useCart, type CartModifier } from "./cart-context";

type Props = {
  item: MenuItem;
  currency: string;
  onClose: () => void;
};

export function ItemDialog({ item, currency, onClose }: Props) {
  const { addLine } = useCart();

  const [variationId, setVariationId] = useState(item.variations[0]?.id ?? "");
  const [selected, setSelected] = useState<Record<string, string[]>>(() =>
    defaultSelections(item.modifierLists),
  );
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const variation = item.variations.find((v) => v.id === variationId) ?? item.variations[0];

  const chosenModifiers = useMemo<CartModifier[]>(() => {
    const out: CartModifier[] = [];
    for (const list of item.modifierLists) {
      for (const id of selected[list.id] ?? []) {
        const m = list.modifiers.find((x) => x.id === id);
        if (m) out.push({ id: m.id, name: m.name, priceCents: m.priceCents });
      }
    }
    return out;
  }, [item.modifierLists, selected]);

  const unitPrice =
    (variation?.priceCents ?? 0) + chosenModifiers.reduce((s, m) => s + m.priceCents, 0);

  const invalidList = item.modifierLists.find((list) => {
    const n = (selected[list.id] ?? []).length;
    if (n < list.minSelected) return true;
    if (list.maxSelected > 0 && n > list.maxSelected) return true;
    return false;
  });
  const canAdd = !!variation && !invalidList;

  function toggle(list: MenuModifierList, modifierId: string) {
    setSelected((prev) => {
      const current = prev[list.id] ?? [];
      if (list.selectionType === "SINGLE") return { ...prev, [list.id]: [modifierId] };
      if (current.includes(modifierId)) {
        return { ...prev, [list.id]: current.filter((x) => x !== modifierId) };
      }
      if (list.maxSelected > 0 && current.length >= list.maxSelected) return prev;
      return { ...prev, [list.id]: [...current, modifierId] };
    });
  }

  function handleAdd() {
    if (!variation || !canAdd) return;
    addLine(
      {
        itemId: item.id,
        itemName: item.name,
        variationId: variation.id,
        variationName: variation.name,
        basePriceCents: variation.priceCents,
        modifiers: chosenModifiers,
        imageUrl: item.imageUrl ?? undefined,
      },
      quantity,
    );
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-primary/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col border-2 border-border bg-background shadow-[8px_8px_0_0_var(--color-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-40 w-full flex-none border-b-2 border-border object-cover"
          />
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold">{item.name}</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="border-2 border-border px-2 leading-none hover:bg-primary hover:text-primary-foreground"
            >
              ✕
            </button>
          </div>
          {item.description && (
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          )}

          {item.variations.length > 1 && (
            <fieldset className="mt-6">
              <legend className="text-xs font-bold uppercase tracking-[0.18em]">Size</legend>
              <div className="mt-2 space-y-2">
                {item.variations.map((v) => (
                  <label
                    key={v.id}
                    className="flex cursor-pointer items-center justify-between border-2 border-border px-3 py-2 text-sm has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="variation"
                        className="accent-current"
                        checked={variationId === v.id}
                        onChange={() => setVariationId(v.id)}
                      />
                      {v.name}
                    </span>
                    <span className="tabular-nums">{formatPrice(v.priceCents, currency)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {item.modifierLists.map((list) => (
            <fieldset key={list.id} className="mt-6">
              <legend className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-[0.18em]">
                {list.name}
                <span className="font-normal text-muted-foreground">{selectionHint(list)}</span>
              </legend>
              <div className="mt-2 space-y-2">
                {list.modifiers.map((m) => {
                  const checked = (selected[list.id] ?? []).includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-center justify-between border-2 border-border px-3 py-2 text-sm has-[:checked]:bg-primary has-[:checked]:text-primary-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type={list.selectionType === "SINGLE" ? "radio" : "checkbox"}
                          name={`mod-${list.id}`}
                          className="accent-current"
                          checked={checked}
                          onChange={() => toggle(list, m.id)}
                        />
                        {m.name}
                      </span>
                      {m.priceCents > 0 && (
                        <span className="tabular-nums">+{formatPrice(m.priceCents, currency)}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t-2 border-border px-5 py-3">
          <div className="flex items-center border-2 border-border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-lg leading-none hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-2 text-lg leading-none hover:bg-primary hover:text-primary-foreground"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button onClick={handleAdd} disabled={!canAdd} className="btn-brutal flex-1 justify-between px-4 py-3 text-xs">
            <span>Add to cart</span>
            <span className="tabular-nums">{formatPrice(unitPrice * quantity, currency)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function defaultSelections(lists: MenuModifierList[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const list of lists) {
    if (list.selectionType === "SINGLE" && list.minSelected >= 1 && list.modifiers[0]) {
      out[list.id] = [list.modifiers[0].id];
    } else {
      out[list.id] = [];
    }
  }
  return out;
}

function selectionHint(list: MenuModifierList): string {
  if (list.selectionType === "SINGLE") return list.minSelected >= 1 ? "Required" : "Choose one";
  if (list.maxSelected > 0) return `Up to ${list.maxSelected}`;
  return "Optional";
}
