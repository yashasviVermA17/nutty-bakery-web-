"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { inr } from "@/lib/menu-data";

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string, weight: string) => void;
  updateQty: (slug: string, weight: string, delta: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "nutty-delight-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    if (items.length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, [items]);

  const add = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((c) => c.slug === item.slug && c.weight === item.weight);
      if (existing) {
        return prev.map((c) =>
          c.slug === item.slug && c.weight === item.weight ? { ...c, qty: c.qty + qty } : c,
        );
      }
      return [...prev, { ...item, qty }];
    });
    toast.success(`${item.name} added to cart`, {
      description: `${item.weight} · ${inr(item.price)}`,
    });
  }, []);

  const remove = useCallback((slug: string, weight: string) => {
    setItems((prev) => prev.filter((c) => !(c.slug === slug && c.weight === weight)));
  }, []);

  const updateQty = useCallback((slug: string, weight: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((c) =>
          c.slug === slug && c.weight === weight ? { ...c, qty: Math.max(1, c.qty + delta) } : c,
        )
        .filter((c) => c.qty > 0),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, c) => n + c.qty, 0), [items]);
  const total = useMemo(() => items.reduce((n, c) => n + c.qty * c.price, 0), [items]);

  const value = useMemo(
    () => ({ items, count, total, open, setOpen, add, remove, updateQty, clear }),
    [items, count, total, open, add, remove, updateQty, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartDrawer() {
  const { items, total, open, setOpen, remove, updateQty, clear } = useCart();

  const waHref = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const lines = items.flatMap((c) => [
      `${origin}/cake/${c.slug}`,
      `Name: ${c.name}`,
      `Quantity: ${c.qty}`,
      `Weight: ${c.weight}`,
      `Price: ${inr(c.price * c.qty)}`,
      "",
    ]);
    const text = ["Hi Nutty Delight Bakery! I'd like to order:", "", ...lines, `Total: ${inr(total)}`].join("\n");
    return `https://wa.me/918770941861?text=${encodeURIComponent(text)}`;
  }, [items, total]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="px-6 pb-4 pt-6">
          <SheetTitle className="flex items-center gap-3 font-display text-2xl text-primary">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your box
            <span className="ml-auto font-sans text-xs text-muted-foreground">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6">
          <AnimatePresence initial={false}>
            {items.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 flex flex-col items-center gap-4 text-center"
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
                  <ShoppingBag className="h-8 w-8 text-gold" />
                </div>
                <p className="font-display text-lg text-primary">Your box is empty</p>
                <p className="max-w-[16rem] text-sm text-muted-foreground">
                  Add a few treats from the menu and we'll bake them fresh for you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {items.map((c) => (
            <motion.div
              key={`${c.slug}-${c.weight}`}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="glass flex gap-4 rounded-[1.4rem] p-3"
            >
              <img
                src={c.image}
                alt={c.name}
                width={96}
                height={96}
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display text-sm leading-tight text-primary">{c.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{c.weight}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${c.name}`}
                    onClick={() => remove(c.slug, c.weight)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-gold/30 px-3 py-1.5">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(c.slug, c.weight, -1)}
                      className="text-primary transition-transform hover:scale-125"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-4 text-center text-sm font-semibold text-primary">
                      {c.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(c.slug, c.weight, 1)}
                      className="text-primary transition-transform hover:scale-125"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-display text-sm text-primary">{inr(c.price * c.qty)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gold/20 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl text-primary">{inr(total)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Same-day delivery in Kanpur · no hidden charges
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full shimmer-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-espresso"
            >
              Checkout on WhatsApp
            </a>
            <button
              type="button"
              onClick={clear}
              className="mt-2 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              Clear cart
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
