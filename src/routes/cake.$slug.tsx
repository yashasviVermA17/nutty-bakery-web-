import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  Clock,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { discountPct, inr, menuItems, type MenuItem } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Eyebrow, Reveal } from "../components/site/ui-bits";

export const Route = createFileRoute("/cake/$slug")({
  component: CakePage,
});

function useCake() {
  const { slug } = Route.useParams();
  const item = useMemo(() => menuItems.find((m) => m.slug === slug), [slug]);
  const related = useMemo(
    () =>
      menuItems
        .filter((m) => m.slug !== slug)
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 6),
    [slug],
  );
  return { item, related };
}

function CakePage() {
  const { item, related } = useCake();

  if (!item) return <NotFound />;

  return (
    <div className="px-6 pb-28 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Breadcrumb name={item.name} />
        <CakeHero item={item} />
        <FrequentlyBought items={related} />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 pt-32">
      <div className="glass rounded-[2rem] px-10 py-16 text-center">
        <p className="font-display text-3xl text-primary">This cake isn't on the counter</p>
        <p className="mt-3 text-sm text-muted-foreground">
          It may have sold out or the link is wrong.
        </p>
        <Link
          to="/menu"
          search={{ category: "all" }}
          className="mt-8 inline-flex rounded-full bg-primary px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground"
        >
          Browse the menu
        </Link>
      </div>
    </div>
  );
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground"
    >
      <Link to="/" className="transition-colors hover:text-primary">
        Home
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <Link to="/menu" search={{ category: "all" }} className="transition-colors hover:text-primary">
        Cakes
      </Link>      <ChevronRight className="h-3.5 w-3.5" />
      <span className="text-primary">{name}</span>
    </nav>
  );
}

function CakeHero({ item }: { item: MenuItem }) {
  const { add, setOpen } = useCart();
  const [active, setActive] = useState(0);
  const [weight, setWeight] = useState(item.weights[0] ?? "1 kg");
  const [flavour, setFlavour] = useState(item.flavours[0] ?? "");
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState(0);

  const discount = discountPct(item);

  const views = useMemo(() => {
    const others = menuItems.filter((m) => m.slug !== item.slug).map((m) => m.image);
    return [item.image, others[0]!, others[1]!].filter(Boolean).slice(0, 3);
  }, [item]);

  const addToCart = (buy = false) => {
    add(
      {
        slug: item.slug,
        name: item.name,
        image: item.image,
        price: item.price,
        weight,
      },
      qty,
    );
    if (buy) setOpen(true);
  };

  const tabs = [
    { label: "Description", content: <DescriptionTab item={item} /> },
    { label: "Ingredients", content: <IngredientsTab /> },
    { label: "Nutrition", content: <NutritionTab /> },
    { label: "Reviews", content: <ReviewsTab item={item} /> },
    { label: "Shipping", content: <ShippingTab /> },
    { label: "FAQs", content: <FaqsTab /> },
  ];

  return (
    <div className="mt-8 grid gap-12 lg:grid-cols-2">
      {/* ---------------- GALLERY ---------------- */}
      <div>
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-soft silk">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={views[active]}
              alt={`${item.name} view ${active + 1}`}
              width={900}
              height={1100}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-[26rem] w-full object-cover md:h-[32rem]"
            />
          </AnimatePresence>
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            {item.badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className="rounded-full px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-espresso shimmer-gold"
              >
                {b}
              </span>
            ))}
          </div>
          {discount > 0 && (
            <span className="absolute right-4 top-4 rounded-full bg-destructive px-2.5 py-1 text-[0.6rem] font-bold text-destructive-foreground">
              -{discount}%
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          {views.map((v, i) => (
            <button
              key={v + i}
              type="button"
              aria-label={`Show ${item.name} view ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300",
                active === i ? "border-gold shadow-gold" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <img src={v} alt="" width={160} height={160} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- DETAILS ---------------- */}
      <div>
        <Eyebrow>{item.category}</Eyebrow>
        <h1 className="mt-4 font-display text-4xl text-primary md:text-5xl">{item.name}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                className={cn("h-4 w-4", s < Math.round(item.rating) ? "fill-gold" : "text-primary/20")}
              />
            ))}
          </span>
          <span className="font-semibold text-primary">{item.rating}</span>
          <span className="text-muted-foreground">· {item.reviews} reviews</span>
        </div>

        <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">{item.note}.</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="font-display text-4xl text-primary">{inr(item.price)}</span>
          {item.mrp > item.price && (
            <span className="text-lg text-muted-foreground line-through">{inr(item.mrp)}</span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600">
              {discount}% off
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-gold" /> Delivery {item.delivery.toLowerCase()}
          </span>
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4 text-gold" /> In stock
          </span>
          {item.eggless && (
            <span className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-gold" /> Eggless
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-gold" /> Baked fresh today
          </span>
        </div>

        {/* Weight */}
        <SelectGroup
          label="Weight"
          options={item.weights}
          value={weight}
          onChange={setWeight}
        />

        {/* Flavour */}
        {item.flavours.length > 1 && (
          <SelectGroup
            label="Flavour"
            options={item.flavours}
            value={flavour}
            onChange={setFlavour}
          />
        )}

        {/* Delivery date + message */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
              Delivery date
            </span>
            <input
              type="date"
              aria-label="Delivery date"
              className="mt-2 w-full rounded-2xl border border-gold/25 bg-card/60 px-5 py-3.5 text-sm text-primary outline-none transition-colors focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
              Message on cake
            </span>
            <input
              type="text"
              maxLength={30}
              placeholder="Happy Birthday, Maa!"
              aria-label="Message on cake"
              className="mt-2 w-full rounded-2xl border border-gold/25 bg-card/60 px-5 py-3.5 text-sm text-primary outline-none transition-colors focus:border-gold"
            />
          </label>
        </div>

        {/* Qty + actions */}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4 rounded-full border border-gold/30 px-4 py-2.5">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-primary transition-transform hover:scale-125"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-5 text-center font-semibold text-primary">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="text-primary transition-transform hover:scale-125"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Toggle wishlist"
            onClick={() => setLiked((v) => !v)}
            className={cn(
              "grid h-12 w-12 place-items-center rounded-full border transition-colors",
              liked
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-gold/30 text-primary hover:bg-accent",
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-destructive")} />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => addToCart(false)}
            className="rounded-full border border-gold/50 px-6 py-4 text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:bg-accent"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => addToCart(true)}
            className="rounded-full bg-primary px-6 py-4 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Buy Now
          </button>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="h-4 w-4 text-gold" /> Same-day delivery in Kanpur · chilled & hand-finished
        </p>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-gold/25 pb-3">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setTab(i)}
                className={cn(
                  "text-xs uppercase tracking-[0.18em] transition-colors",
                  tab === i ? "font-semibold text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="pt-5">{tabs[tab]!.content}</div>
        </div>
      </div>
    </div>
  );
}

function SelectGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-7">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              value === o
                ? "border-gold bg-gold text-espresso"
                : "border-gold/25 text-primary hover:bg-accent",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function DescriptionTab({ item }: { item: MenuItem }) {
  return (
    <p className="max-w-xl leading-relaxed text-muted-foreground">
      {item.note}. Every {item.name.toLowerCase()} is assembled to order in our Kanpur kitchen, chilled
      overnight and finished by hand on the morning of delivery — never frozen, never pre-made.
    </p>
  );
}

function IngredientsTab() {
  const base = [
    "Fresh cream & unsalted butter",
    "Belgian couverture chocolate",
    "Farm eggs or premium eggless blend",
    "Vanilla bean & natural extracts",
    "Preservative-free fruit compotes",
  ];
  return (
    <ul className="max-w-xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
      {base.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

function NutritionTab() {
  const rows = [
    ["Serving size", "100 g"],
    ["Calories", "≈ 380 kcal"],
    ["Protein", "4 g"],
    ["Carbohydrates", "42 g"],
    ["Sugars", "30 g"],
    ["Fat", "21 g"],
  ];
  return (
    <div className="max-w-md overflow-hidden rounded-2xl border border-gold/25">
      {rows.map(([k, v], i) => (
        <div
          key={k}
          className={cn(
            "flex items-center justify-between px-4 py-2.5 text-sm",
            i % 2 === 0 ? "bg-card/40" : "bg-transparent",
          )}
        >
          <span className="text-muted-foreground">{k}</span>
          <span className="font-medium text-primary">{v}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab({ item }: { item: MenuItem }) {
  const reviews = [
    {
      name: "Aarushi M.",
      stars: 5,
      text: "Ordered for my daughter's birthday — everyone asked where it was from. Flawless.",
    },
    {
      name: "Rahul S.",
      stars: 4,
      text: "Really fresh and the eggless version tastes exactly like the classic.",
    },
    {
      name: "Kavita D.",
      stars: 5,
      text: "Same-day delivery was on time and the cake was chilled perfectly.",
    },
  ];
  return (
    <div className="max-w-xl space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-display text-4xl text-primary">{item.rating}</span>
        <div>
          <div className="flex gap-0.5 text-gold">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-4 w-4 fill-gold" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Based on {item.reviews} reviews</p>
        </div>
      </div>
      {reviews.map((r) => (
        <div key={r.name} className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full shimmer-gold text-xs font-bold text-espresso">
              {r.name.charAt(0)}
            </span>
            <span className="font-display text-sm text-primary">{r.name}</span>
            <span className="ml-auto flex gap-0.5 text-gold">
              {Array.from({ length: r.stars }).map((_, s) => (
                <Star key={s} className="h-3 w-3 fill-gold" />
              ))}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
        </div>
      ))}
    </div>
  );
}

function ShippingTab() {
  return (
    <ul className="max-w-xl space-y-3 text-sm leading-relaxed text-muted-foreground">
      <li className="flex gap-3">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        Same-day delivery across Kanpur when ordered before 4 PM.
      </li>
      <li className="flex gap-3">
        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        Delivered chilled and hand-finished in eco-friendly packaging.
      </li>
      <li className="flex gap-3">
        <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
        Free delivery on orders above ₹999, otherwise a small flat fee applies.
      </li>
    </ul>
  );
}

function FaqsTab() {
  const faqs = [
    ["Can I get this in eggless?", "Yes — every cake has an eggless version made with a premium blend."],
    ["How far in advance should I order?", "2–3 days is ideal for custom designs; same-day works for signatures."],
    ["Do you deliver outside Kanpur?", "We currently deliver within Kanpur city limits."],
  ];
  return (
    <div className="max-w-xl space-y-3">
      {faqs.map(([q, a]) => (
        <div key={q} className="glass rounded-2xl p-4">
          <p className="font-display text-sm text-primary">{q}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a}</p>
        </div>
      ))}
    </div>
  );
}

function FrequentlyBought({ items }: { items: MenuItem[] }) {
  return (
    <section className="mt-24">
      <Reveal>
        <Eyebrow>Pairs perfectly with</Eyebrow>
        <h2 className="mt-4 font-display text-3xl text-primary md:text-4xl">
          Frequently Bought Together
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.07}>
            <Link
              to="/cake/$slug"
              params={{ slug: p.slug }}
              className="glass group flex items-center gap-4 rounded-[1.6rem] p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-gold"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={160}
                height={160}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <h3 className="truncate font-display text-base text-primary">{p.name}</h3>
                <p className="mt-1 text-sm text-gold">{inr(p.price)}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
