"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP_NUMBER = "918770941861";

type OrderNowContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const OrderNowContext = createContext<OrderNowContextValue | null>(null);

export function OrderNowProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <OrderNowContext.Provider value={value}>
      {children}
      <OrderNowModal />
    </OrderNowContext.Provider>
  );
}

export function useOrderNow() {
  const ctx = useContext(OrderNowContext);
  if (!ctx) throw new Error("useOrderNow must be used within OrderNowProvider");
  return ctx;
}

const inputClass =
  "w-full rounded-2xl border border-gold/25 bg-card/60 px-5 py-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold";

function OrderNowModal() {
  const { open, setOpen } = useOrderNow();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    const lines = [
      "Hi Nutty Delight Bakery! I'd like to place an order:",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
    ];
    if (details) lines.push(`Order details: ${details}`);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    window.setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[90] grid place-items-center bg-espresso/85 p-4 backdrop-blur-md"
        >
          <motion.form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-[2rem] p-7 md:p-9"
          >
            <button
              type="button"
              aria-label="Close order form"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-primary transition-colors hover:bg-accent"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-display text-2xl text-primary">Place your order</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Fill in your details and hit send — your order goes straight to us on WhatsApp.
            </p>

            <div className="mt-7 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted-foreground">Your name</span>
                <input required name="name" placeholder="Full name" aria-label="Your name" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted-foreground">Phone / WhatsApp</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  aria-label="Phone number"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted-foreground">Delivery address</span>
                <input required name="address" placeholder="Address with city & pincode" aria-label="Delivery address" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs text-muted-foreground">Order details</span>
                <textarea
                  name="details"
                  rows={4}
                  placeholder="Cake flavour, weight, date, occasion…"
                  aria-label="Order details"
                  className={inputClass}
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <MessageCircle className="h-4 w-4" />
              {sent ? "Opening WhatsApp…" : "Send on WhatsApp"}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
