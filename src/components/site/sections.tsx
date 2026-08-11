import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import {
  Star,
  Heart,
  Eye,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  Award,
  Leaf,
  Croissant,
  Smile,
  Cake,
  BadgeCheck,
  X,
} from "lucide-react";
import {
  bestSellers,
  categories,
  gallery,
  instagramGrid,
  process,
  products,
  slugify,
  testimonials,
  type Product,
} from "@/lib/bakery-data";
import heroCake from "@/assets/hero-cake.jpg";
import storefront from "@/assets/storefront.png";
import { Eyebrow, Logo, Magnetic, MaskedHeading, Particles, Reveal } from "./ui-bits";

/* ------------------------------- HERO ------------------------------- */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh] overflow-hidden warm-surface">
      <motion.div style={{ y: yImg }} className="absolute inset-0">
        <img
          src={heroCake}
          alt="Luxury chocolate drip cake with floating macarons"
          width={1600}
          height={1104}
          className="h-full w-full animate-slow-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </motion.div>

      <Particles count={22} tone="gold" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-96 w-96 rounded-full bg-rose-gold/20 blur-3xl" />

      <motion.div
        style={{ y: yText, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pb-24 pt-36 md:px-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="glass w-fit rounded-[2.5rem] p-8 md:p-12"
        >
          <div className="flex items-center gap-5">
            <Logo className="h-20 w-20 rounded-full md:h-24 md:w-24" />
            <Eyebrow>Artisan bakery · Est. 2019</Eyebrow>
          </div>

          <h1 className="mt-7 max-w-2xl font-display text-[2.9rem] leading-[1.03] text-primary md:text-7xl">
            Fall in love with
            <span className="block gold-text">every single bite.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            Hand-crafted celebration cakes, French pastries and small-batch desserts — baked fresh each
            morning with real butter, real chocolate and a great deal of patience.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic
              as="a"
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground shadow-lift transition-transform hover:scale-[1.04]"
            >
              <ShoppingBag className="h-4 w-4" /> Explore Menu
            </Magnetic>
            <Magnetic
              as="a"
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-accent"
            >
              Custom Order
            </Magnetic>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-gold/25 pt-6 text-sm">
            {[
              ["4.9★", "Google rating"],
              ["12k+", "Cakes baked"],
              ["100%", "Fresh, eggless option"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl text-primary">{v}</div>
                <div className="text-xs tracking-wide text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
        <span className="animate-float-soft inline-block">Scroll</span>
      </div>
    </section>
  );
}

/* ----------------------------- MARQUEE ----------------------------- */

export function Marquee() {
  const items = ["Fresh Daily", "Real Belgian Chocolate", "Custom Designs", "Eggless Available", "Same Day Delivery"];
  return (
    <div className="overflow-hidden border-y border-gold/25 bg-secondary py-4">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-lg tracking-wide text-primary/70"
          >
            {t} <Sparkles className="h-4 w-4 text-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- CATEGORIES ---------------------------- */

function CategoryTile({ c, offset }: { c: (typeof categories)[number]; offset: number }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const start = window.setTimeout(() => {
      setIdx((v) => v + 1);
    }, offset * 220);
    const id = window.setInterval(() => setIdx((v) => v + 1), 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [offset]);

  const src = c.images[idx % c.images.length]!;

  return (
    <Link
      to="/menu"
      search={{ category: c.slug }}
      className="group relative block h-72 w-56 shrink-0 overflow-hidden rounded-[2rem] shadow-soft silk transition-all duration-500 hover:shadow-lift"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={c.label}
          loading="lazy"
          width={900}
          height={1100}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
      <span className="absolute bottom-5 left-5 font-display text-xl text-cream">{c.label}</span>
    </Link>
  );
}

export function Categories() {
  return (
    <section id="categories" className="relative overflow-hidden px-0 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Reveal>
          <Eyebrow>Browse the counter</Eyebrow>
        </Reveal>
        <MaskedHeading
          text="Every craving has a category"
          className="mt-5 max-w-3xl text-4xl text-primary md:text-6xl"
        />
      </div>

      <div className="group mt-12 overflow-hidden">
        <div className="animate-marquee flex w-max gap-6 group-hover:[animation-play-state:paused]">
          {[...categories, ...categories].map((c, i) => (
            <CategoryTile key={`${c.slug}-${i}`} c={c} offset={i} />
          ))}
        </div>
      </div>
    </section>
  );
}


/* --------------------------- PRODUCT CARDS --------------------------- */

function ProductCard({ p, onQuickView, i }: { p: Product; onQuickView: (p: Product) => void; i: number }) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const images = p.images ?? [p.image];

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => setImgIdx((v) => (v + 1) % images.length), 30000);
    return () => window.clearInterval(id);
  }, [images.length]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 9, ry: px * 11 });
  };

  return (
    <Reveal delay={(i % 3) * 0.08}>
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        animate={{ rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{ transformStyle: "preserve-3d", perspective: 900 }}
        className="glass group relative overflow-hidden rounded-[2rem] p-4 transition-shadow duration-500 hover:shadow-gold"
      >
        <div className="relative overflow-hidden rounded-[1.4rem]">
          <Link to="/menu" search={{ category: slugify(p.category) }} aria-label={`View ${p.name} on the menu`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={images[imgIdx]}
                src={images[imgIdx]}
                alt={p.name}
                loading="lazy"
                width={900}
                height={1100}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-72 w-full object-cover"
              />
            </AnimatePresence>
          </Link>

          {p.badge && (
            <span className="absolute left-4 top-4 animate-float-soft rounded-full shimmer-gold px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-espresso">
              {p.badge}
            </span>
          )}
          <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <button
              type="button"
              aria-label="Add to wishlist"
              onClick={() => setLiked((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full glass text-primary"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-destructive text-destructive" : ""}`} />
            </button>
            <button
              type="button"
              aria-label="Quick view"
              onClick={() => onQuickView(p)}
              className="grid h-10 w-10 place-items-center rounded-full glass text-primary"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-2 pb-1 pt-5">
          <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
            {p.category}
          </span>
          <h3 className="mt-2 font-display text-xl text-primary">{p.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
          <div className="mt-5 flex items-center justify-between">
            <span className="font-display text-lg text-primary">{p.price}</span>
            <a
              href="#contact"
              className="rounded-full bg-primary px-5 py-2.5 text-[0.65rem] uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105"
            >
              Order
            </a>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Menu() {
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <section id="menu" className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <Eyebrow>The signature menu</Eyebrow>
            </Reveal>
            <MaskedHeading
              text="Baked to order, never in bulk"
              className="mt-5 max-w-2xl text-4xl text-primary md:text-6xl"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Ten signatures on the counter every day, plus fully bespoke designs for weddings and
              celebrations.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} i={i} onQuickView={setQuick} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {quick && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuick(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-espresso/70 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative grid max-w-3xl gap-6 overflow-hidden rounded-[2rem] p-4 md:grid-cols-2"
            >
              <img
                src={quick.image}
                alt={quick.name}
                width={900}
                height={1100}
                className="h-72 w-full rounded-[1.4rem] object-cover md:h-full"
              />
              <div className="p-4 pr-10">
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
                  {quick.category}
                </span>
                <h3 className="mt-2 font-display text-3xl text-primary">{quick.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{quick.note}</p>
                <p className="mt-6 font-display text-2xl text-primary">{quick.price}</p>
                <a
                  href="#contact"
                  onClick={() => setQuick(null)}
                  className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.2em] text-primary-foreground"
                >
                  Order this
                </a>
              </div>
              <button
                type="button"
                aria-label="Close quick view"
                onClick={() => setQuick(null)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full glass text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------- BEST SELLERS --------------------------- */

export function BestSellers() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let paused = false;
    const enter = () => (paused = true);
    const leave = () => (paused = false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    const id = window.setInterval(() => {
      if (paused) return;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollLeft = el.scrollLeft >= max - 4 ? 0 : el.scrollLeft + 1.2;
    }, 22);
    return () => {
      window.clearInterval(id);
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <section className="relative overflow-hidden cocoa-surface py-24 md:py-32">
      <Particles count={20} tone="gold" />
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Eyebrow>Most loved</Eyebrow>
        <MaskedHeading text="This week's best sellers" className="mt-5 text-4xl text-cream md:text-6xl" />
      </div>

      <div
        ref={trackRef}
        className="mt-12 flex gap-8 overflow-x-auto px-6 pb-4 md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {[...bestSellers, ...bestSellers].map((p, i) => (
          <Link
            to="/menu"
            search={{ category: slugify(p.category) }}
            key={`${p.name}-${i}`}
            className="group relative block w-72 shrink-0 overflow-hidden rounded-[2rem] glass-dark p-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-gold"
          >
            <div className="overflow-hidden rounded-[1.4rem]">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                width={900}
                height={1100}
                className="h-64 w-full object-cover transition-transform duration-[1.2s] group-hover:scale-115"
              />
            </div>
            <div className="px-3 py-4">
              <h3 className="font-display text-lg text-cream">{p.name}</h3>
              <div className="mt-1 flex items-center justify-between text-sm text-cream/60">
                <span>{p.category}</span>
                <span className="text-gold">{p.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ ABOUT ------------------------------ */

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img
              src={storefront}
              alt="Nutty Delight Bakery storefront lit up at night with outdoor seating"
              loading="lazy"
              width={1600}
              height={1200}
              className="w-full rounded-[2.5rem] object-cover shadow-lift"
            />
            <div className="glass absolute -bottom-10 -right-4 flex items-center gap-4 rounded-[1.8rem] p-5 md:-right-10">
              <Logo className="h-16 w-16 rounded-full" />
              <div>
                <p className="font-display text-lg text-primary">By Vithika</p>
                <p className="text-xs tracking-widest text-muted-foreground">HEAD PASTRY CHEF</p>
              </div>
            </div>
            <Croissant className="absolute -left-6 top-10 h-10 w-10 animate-float-soft text-gold" />
            <Leaf className="absolute -right-4 top-1/3 h-8 w-8 animate-float-soft text-gold/70" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
          </Reveal>
          <MaskedHeading
            text="A tiny home kitchen that never stopped baking"
            className="mt-5 text-4xl leading-tight text-primary md:text-5xl"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Nutty Delight began with one oven, one whisk and a stubborn belief that a cake should taste
              as beautiful as it looks. Today Vithika and her small team bake every order by hand —
              no premixes, no shortcuts, no compromise on butter.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              From single-tier birthday cakes to hundred-guest wedding centrepieces, each design starts
              with a conversation and ends with a bite you remember.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Award, t: "Award-winning", s: "Best patisserie 2024" },
              { icon: Leaf, t: "Pure ingredients", s: "No preservatives" },
              { icon: Sparkles, t: "Custom design", s: "Made for your day" },
            ].map(({ icon: Icon, t, s }) => (
              <div key={t} className="glass rounded-[1.5rem] p-5">
                <Icon className="h-5 w-5 text-gold" />
                <p className="mt-3 font-display text-base text-primary">{t}</p>
                <p className="text-xs text-muted-foreground">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- GALLERY ----------------------------- */

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>From the counter</Eyebrow>
        </Reveal>
        <MaskedHeading text="A gallery of good mornings" className="mt-5 text-4xl text-primary md:text-6xl" />

        <div className="mt-12 columns-2 gap-5 lg:columns-3 [&>*]:mb-5">
          {gallery.map((g, i) => (
            <Reveal key={g.alt} delay={(i % 3) * 0.06}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden rounded-[1.8rem] shadow-soft"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className={`w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110 ${
                    g.h === "tall" ? "h-[26rem]" : "h-64"
                  }`}
                />
                <span className="absolute inset-0 glass opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute bottom-4 left-4 text-left font-display text-sm text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  View
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] grid place-items-center bg-espresso/85 p-6 backdrop-blur-md"
          >
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              src={gallery[open]!.src}
              alt={gallery[open]!.alt}
              className="max-h-[85vh] max-w-full rounded-[1.6rem] object-contain shadow-lift"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* --------------------------- TESTIMONIALS --------------------------- */

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % testimonials.length), 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-3xl" />
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Eyebrow>Kind words</Eyebrow>
        </Reveal>
        <MaskedHeading text="Loved by 12,000 celebrations" className="mt-5 text-4xl text-primary md:text-5xl" />

        <div className="relative mt-12 h-64 md:h-52">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] p-8"
            >
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <p className="mt-5 font-display text-lg leading-relaxed text-primary md:text-xl">
                “{testimonials[i]!.quote}”
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full shimmer-gold font-display text-sm text-espresso">
                  {testimonials[i]!.name.charAt(0)}
                </span>
                <span className="text-left text-sm">
                  <span className="block text-foreground">{testimonials[i]!.name}</span>
                  <span className="text-xs text-muted-foreground">{testimonials[i]!.role}</span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((t, idx) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Show review ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === i ? "w-8 bg-gold" : "w-2 bg-primary/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------- HAPPY CUSTOMERS -------------------------- */

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

export function HappyCustomers() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const happy = useCountUp(12000, inView);
  const orders = useCountUp(28000, inView);
  const rating = useCountUp(49, inView);

  const stats = [
    { icon: Smile, label: "Happy customers served", suffix: "+", value: happy },
    { icon: Cake, label: "Cakes baked & delivered", suffix: "+", value: orders },
    { icon: BadgeCheck, label: "Google rating", suffix: ".9", value: rating, lead: "4." },
  ];

  return (
    <section className="px-6 pb-24 md:px-12 md:pb-32">
      <div ref={ref} className="mx-auto max-w-7xl">
        <div className="cocoa-surface relative overflow-hidden rounded-[3rem] px-8 py-16 md:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative grid gap-10 md:grid-cols-3">
            {stats.map(({ icon: Icon, label, value, suffix, lead }, i) => (
              <Reveal key={label} delay={i * 0.12} className="text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full shimmer-gold font-display text-espresso">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-5 font-display text-4xl text-primary-foreground md:text-5xl">
                  {lead}
                  {value}
                  {suffix}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-primary-foreground/70">
                  {label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ PROCESS ------------------------------ */

export function Process() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
        </Reveal>
        <MaskedHeading text="From idea to first slice" className="mt-5 text-4xl text-primary md:text-6xl" />

        <div className="relative mt-16 grid gap-10 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent md:block" />
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.12}>
              <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-full shimmer-gold font-display text-sm text-espresso shadow-gold">
                  {p.step}
                </span>
                <h3 className="mt-5 font-display text-xl text-primary">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ OFFER ------------------------------ */

function useCountdown() {
  const [left, setLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 999);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        h: Math.floor(diff / 3.6e6),
        m: Math.floor((diff % 3.6e6) / 6e4),
        s: Math.floor((diff % 6e4) / 1000),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return left;
}

export function Offer() {
  const { h, m, s } = useCountdown();
  const [confetti, setConfetti] = useState<Array<{ l: number; d: number; r: number }>>([]);

  useEffect(() => {
    setConfetti(
      Array.from({ length: 24 }, () => ({
        l: Math.random() * 100,
        d: Math.random() * 8,
        r: Math.random() * 360,
      })),
    );
  }, []);

  return (
    <section className="px-6 pb-24 md:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] cocoa-surface px-8 py-16 text-center md:px-16 md:py-20">
        {confetti.map((c, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute top-0 h-3 w-1.5 rounded-sm bg-gold/70 animate-drift"
            style={{
              left: `${c.l}%`,
              animationDelay: `${c.d}s`,
              animationDuration: "16s",
              rotate: `${c.r}deg`,
            }}
          />
        ))}
        <Sparkles className="mx-auto h-7 w-7 text-gold" />
        <h2 className="mt-5 font-display text-3xl text-cream md:text-5xl">
          Limited edition <span className="gold-text">Hazelnut Praline</span> cake
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70">
          Only 20 baked each day. Order before midnight for 15% off with code <strong>NUTTY15</strong>.
        </p>

        <div className="mt-9 flex justify-center gap-4">
          {[
            [h, "Hours"],
            [m, "Minutes"],
            [s, "Seconds"],
          ].map(([v, l]) => (
            <div key={l as string} className="glass-dark w-24 rounded-2xl px-4 py-4">
              <div className="font-display text-3xl text-gold">{String(v).padStart(2, "0")}</div>
              <div className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/50">{l}</div>
            </div>
          ))}
        </div>

        <Magnetic
          as="a"
          href="#contact"
          className="mt-10 inline-flex rounded-full shimmer-gold px-9 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-espresso"
        >
          Claim the offer
        </Magnetic>
      </div>
    </section>
  );
}

/* ---------------------------- INSTAGRAM ---------------------------- */

export function InstagramFeed() {
  return (
    <section className="px-6 pb-24 md:px-12">
      <div className="mx-auto max-w-7xl text-center">
        <Reveal>
          <Eyebrow>@nuttydelight.bakery</Eyebrow>
        </Reveal>
        <MaskedHeading text="Fresh from our feed" className="mt-5 text-4xl text-primary md:text-5xl" />

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {instagramGrid.map((src, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-[1.4rem]"
              >
                <img
                  src={src}
                  alt="Nutty Delight bakery instagram post"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-115"
                />
                <span className="absolute inset-0 grid place-items-center bg-espresso/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Heart className="h-6 w-6 text-cream transition-transform duration-500 group-hover:scale-125 group-hover:fill-cream" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- CONTACT ----------------------------- */

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="px-6 pb-28 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="glass h-full rounded-[2.5rem] p-8 md:p-10">
            <Eyebrow>Visit or order</Eyebrow>
            <h2 className="mt-5 font-display text-3xl text-primary md:text-4xl">
              Let's design your next celebration
            </h2>

            <ul className="mt-8 space-y-5 text-sm">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rajat+Jayanti+Complex%2C+Kushabhau+Thakre+Marg%2C+Ganesh+Nagar%2C+Vijay+Nagar%2C+A-16%2C+Scheme+No+54%2C+Indore%2C+Madhya+Pradesh+452010%2C+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Rajat Jayanti Complex, A-16, Scheme No 54, Vijay Nagar, Indore 452010 — open in Google Maps for live directions.
                </a>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span className="text-muted-foreground">
                  Open every day · 12:00 PM – 11:00 PM
                  <br />
                  Takeout &amp; pick-up available
                </span>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <a href="https://wa.me/919000000000" className="text-muted-foreground hover:text-primary">
                  WhatsApp us for same-day orders
                </a>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-gold/25">
              <iframe
                title="Nutty Delight Bakery location map"
                src="https://www.google.com/maps?q=Rajat+Jayanti+Complex%2C+Kushabhau+Thakre+Marg%2C+Ganesh+Nagar%2C+Vijay+Nagar%2C+A-16%2C+Scheme+No+54%2C+Indore%2C+Madhya+Pradesh+452010%2C+India&z=16&output=embed"
                loading="lazy"
                className="h-64 w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="glass flex h-full flex-col gap-4 rounded-[2.5rem] p-8 md:p-10"
          >
            <h3 className="font-display text-2xl text-primary">Custom order enquiry</h3>
            <input
              required
              placeholder="Your name"
              aria-label="Your name"
              className="rounded-2xl border border-gold/25 bg-card/60 px-5 py-4 text-sm outline-none transition-colors focus:border-gold"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              aria-label="Email address"
              className="rounded-2xl border border-gold/25 bg-card/60 px-5 py-4 text-sm outline-none transition-colors focus:border-gold"
            />
            <input
              placeholder="Occasion (birthday, wedding…)"
              aria-label="Occasion"
              className="rounded-2xl border border-gold/25 bg-card/60 px-5 py-4 text-sm outline-none transition-colors focus:border-gold"
            />
            <textarea
              required
              rows={5}
              placeholder="Tell us about the cake you're dreaming of…"
              aria-label="Message"
              className="rounded-2xl border border-gold/25 bg-card/60 px-5 py-4 text-sm outline-none transition-colors focus:border-gold"
            />
            <button
              type="submit"
              className="mt-auto rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              {sent ? "Thank you — we'll reply shortly" : "Send enquiry"}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
