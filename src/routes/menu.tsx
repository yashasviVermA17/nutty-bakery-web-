import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowUpDown, Clock, Heart, Menu, RotateCcw, SlidersHorizontal, Star, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import menuCard1 from "@/assets/products/menu cards.webp";
import menuCard2 from "@/assets/products/menu cards do.webp";
import menuCard3 from "@/assets/products/menu cards 4.webp";
import menuCard4 from "@/assets/products/menu card5.webp";
import {
  categoryCount,
  categoryOptions,
  discountPct,
  flavourOptions,
  inr,
  menuItems,
  occasionOptions,
  quickPicks,
  weightOptions,
  type MenuItem,
} from "@/lib/menu-data";
import { useCart } from "@/lib/cart";
import { Eyebrow, MaskedHeading, Reveal } from "../components/site/ui-bits";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : "all",
  }),
  component: MenuPage,
});

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "top", label: "Top Rated" },
  { value: "low", label: "Price: Low to High" },
  { value: "high", label: "Price: High to Low" },
];

type Filters = {
  egg: "all" | "eggless" | "with-egg";
  flavours: string[];
  weights: string[];
  occasions: string[];
  quick: string[];
  rating: number;
};

const initialFilters: Filters = {
  egg: "all",
  flavours: [],
  weights: [],
  occasions: [],
  quick: [],
  rating: 0,
};

function MenuPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate();
  const [priceMax, setPriceMax] = useState(2000);
  const [sort, setSort] = useState("popular");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount =
    filters.flavours.length +
    filters.weights.length +
    filters.occasions.length +
    filters.quick.length +
    (filters.egg !== "all" ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (priceMax < 2000 ? 1 : 0);

  const activeCategory = categoryOptions.some((c) => c.slug === category) ? category : "all";

  const filtered = useMemo(() => {
    const list = menuItems.filter((m) => {
      if (activeCategory !== "all" && m.categorySlug !== activeCategory) return false;
      if (m.price > priceMax) return false;
      if (filters.egg === "eggless" && !m.eggless) return false;
      if (filters.egg === "with-egg" && m.eggless) return false;
      if (filters.flavours.length && !filters.flavours.some((f) => m.flavours.includes(f)))
        return false;
      if (filters.weights.length && !filters.weights.some((w) => m.weights.includes(w))) return false;
      if (filters.occasions.length && !filters.occasions.some((o) => m.occasions.includes(o)))
        return false;
      if (filters.quick.includes("best-seller") && !m.bestSeller) return false;
      if (filters.quick.includes("new") && !m.newArrival) return false;
      if (filters.quick.includes("discounted") && discountPct(m) === 0) return false;
      if (filters.quick.includes("today") && m.delivery !== "Today") return false;
      if (filters.rating && m.rating < filters.rating) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "top") return b.rating - a.rating;
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return b.reviews - a.reviews;
    });
  }, [activeCategory, priceMax, filters, sort]);

  const toggle = (key: "flavours" | "weights" | "occasions" | "quick", value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const reset = () => {
    setFilters(initialFilters);
    setPriceMax(2000);
    setSort("popular");
    navigate({ to: "/menu", search: { category: "all" } });
  };

  return (
    <section className="px-6 pb-24 pt-36 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>All Products</Eyebrow>
        </Reveal>
        <MaskedHeading
          text="Freshly Baked Happiness Every Day"
          className="mt-5 max-w-3xl text-4xl text-primary md:text-6xl"
        />
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Handmade cakes, cookies and pastries for every celebration — baked this morning,
            delivered today.
          </p>
        </Reveal>

        <div className="mt-8">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-espresso shadow-gold transition-transform hover:scale-[1.03]"
              >
                <Menu className="h-4 w-4" />
                View Menu
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl border-gold/20 bg-background/95 p-0 backdrop-blur-xl sm:rounded-[2rem]">
              <DialogHeader className="px-7 pt-7">
                <DialogTitle className="font-display text-2xl text-primary">
                  Our Menu
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Browse everything we baked fresh today.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] px-7 pb-7">
                <div className="space-y-5">
                  {[menuCard1, menuCard2, menuCard3, menuCard4].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Menu card ${i + 1}`}
                      loading="lazy"
                      width={1200}
                      height={1600}
                      className="w-full rounded-2xl object-contain shadow-gold"
                    />
                  ))}
                </div>
              </ScrollArea>
              <DialogClose className="absolute right-4 top-4 rounded-full border border-gold/30 p-2 text-muted-foreground transition-colors hover:text-primary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* ---------------- FILTERS ---------------- */}
          <aside className={cn("lg:sticky lg:top-28 lg:self-start", !showFilters && "hidden lg:block")}>
            <div className="glass rounded-[2rem] p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-primary">Filters</h2>
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              </div>

              {/* Categories */}
              <div className="mt-6">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Categories
                </p>
                <div className="mt-3 space-y-1.5">
                  {categoryOptions.map((c) => (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => navigate({ to: "/menu", search: { category: c.slug } })}
                      className={cn(
                        "flex w-full items-center justify-between rounded-full border px-4 py-2 text-sm transition-colors",
                        activeCategory === c.slug
                          ? "border-gold bg-gold text-espresso"
                          : "border-gold/25 text-primary hover:bg-accent",
                      )}
                    >
                      {c.label}
                      <span className="text-xs opacity-70">{categoryCount(c.slug)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mt-7">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Price · up to {inr(priceMax)}
                </p>
                <Slider
                  value={[priceMax]}
                  max={2000}
                  min={200}
                  step={100}
                  onValueChange={(v) => setPriceMax(v[0] ?? 2000)}
                  className="mt-5"
                />
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>{inr(200)}</span>
                  <span>{inr(2000)}</span>
                </div>
              </div>

              {/* Egg / Eggless */}
              <div className="mt-7">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Egg / Eggless
                </p>
                <div className="mt-3 flex gap-2">
                  {(
                    [
                      ["all", "All"],
                      ["eggless", "Eggless"],
                      ["with-egg", "With egg"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, egg: value }))}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                        filters.egg === value
                          ? "border-gold bg-gold text-espresso"
                          : "border-gold/25 text-primary hover:bg-accent",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavours */}
              <FilterChips
                label="Flavours"
                options={flavourOptions}
                selected={filters.flavours}
                onToggle={(v) => toggle("flavours", v)}
              />

              {/* Weight */}
              <FilterChips
                label="Weight"
                options={weightOptions}
                selected={filters.weights}
                onToggle={(v) => toggle("weights", v)}
              />

              {/* Occasion */}
              <FilterChips
                label="Occasion"
                options={occasionOptions}
                selected={filters.occasions}
                onToggle={(v) => toggle("occasions", v)}
              />

              {/* Quick picks */}
              <div className="mt-7">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Quick picks
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {quickPicks.map((q) => (
                    <button
                      key={q.slug}
                      type="button"
                      onClick={() => toggle("quick", q.slug)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                        filters.quick.includes(q.slug)
                          ? "border-gold bg-gold text-espresso"
                          : "border-gold/25 text-primary hover:bg-accent",
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mt-7">
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                  Rating
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    [0, "Any"],
                    [4, "4★+"],
                    [4.5, "4.5★+"],
                    [4.8, "4.8★+"],
                  ].map(([r, label]) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, rating: r as number }))}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                        filters.rating === r
                          ? "border-gold bg-gold text-espresso"
                          : "border-gold/25 text-primary hover:bg-accent",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ---------------- CATALOG ---------------- */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-primary">{filtered.length}</span> of{" "}
                {menuItems.length} delights
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2.5 text-xs uppercase tracking-widest text-primary lg:hidden"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-[0.6rem] text-espresso">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort products"
                    className="appearance-none rounded-full border border-gold/40 bg-card/60 py-2.5 pl-11 pr-9 text-xs uppercase tracking-widest text-primary outline-none transition-colors focus:border-gold"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {showFilters && (
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-gold/40 py-3 text-xs uppercase tracking-widest text-primary lg:hidden"
              >
                <X className="h-4 w-4" /> Close filters
              </button>
            )}

            {filtered.length === 0 ? (
              <div className="mt-16 flex flex-col items-center gap-4 rounded-[2rem] glass px-6 py-20 text-center">
                <p className="font-display text-2xl text-primary">No delights match</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try widening the price range or clearing a few filters.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-2 rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((m, i) => (
                  <CatalogCard key={m.slug} m={m} i={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterChips({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="mt-7">
      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
              selected.includes(o)
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

function CatalogCard({ m, i }: { m: MenuItem; i: number }) {
  const { add, setOpen } = useCart();
  const [liked, setLiked] = useState(false);
  const discount = discountPct(m);

  const buyNow = () => {
    add({ slug: m.slug, name: m.name, image: m.image, price: m.price, weight: m.weights[0] ?? "1 kg" });
    setOpen(true);
  };

  return (
    <Reveal delay={(i % 3) * 0.07}>
      <motion.article className="glass group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-4 transition-shadow duration-500 hover:shadow-gold">
        <div className="relative overflow-hidden rounded-[1.4rem]">
          <Link to="/cake/$slug" params={{ slug: m.slug }} aria-label={`View ${m.name}`}>
            <img
              src={m.image}
              alt={m.name}
              loading="lazy"
              width={900}
              height={1100}
              className="h-64 w-full object-cover transition-transform duration-[1.1s] group-hover:scale-110"
            />
          </Link>

          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            {m.badges.slice(0, 2).map((b) => (
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

          <button
            type="button"
            aria-label="Toggle wishlist"
            onClick={() => setLiked((v) => !v)}
            className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full glass text-primary transition-transform hover:scale-110"
          >
            <Heart className={cn("h-4 w-4", liked && "fill-destructive text-destructive")} />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span className="font-semibold text-primary">{m.rating}</span>
            <span>({m.reviews} reviews)</span>
          </div>
          <h3 className="mt-2 font-display text-xl leading-snug text-primary">
            <Link to="/cake/$slug" params={{ slug: m.slug }} className="transition-colors hover:text-gold">
              {m.name}
            </Link>
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.note}</p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-gold" />
            <span>
              <span className={cn("font-medium", m.delivery === "Today" ? "text-primary" : "")}>
                {m.delivery}
              </span>
              {" · "}
              {m.weights[0]}+
            </span>
            {m.eggless && (
              <span className="ml-auto rounded-full border border-gold/40 px-2 py-0.5 text-[0.58rem] uppercase tracking-widest text-gold">
                Eggless
              </span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-xl text-primary">{inr(m.price)}</span>
            {m.mrp > m.price && (
              <span className="text-sm text-muted-foreground line-through">{inr(m.mrp)}</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => add({ slug: m.slug, name: m.name, image: m.image, price: m.price, weight: m.weights[0] ?? "1 kg" })}
              className="rounded-full border border-gold/50 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] text-primary transition-colors hover:bg-accent"
            >
              Add to Cart
            </button>
            <button
              type="button"
              onClick={buyNow}
              className="rounded-full bg-primary px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Buy Now
            </button>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
