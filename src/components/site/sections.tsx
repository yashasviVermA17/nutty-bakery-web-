import { AnimatePresence, motion, useInView, useScroll, useTransform } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

import {
  Star,
  Heart,
  Eye,
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
  process,
  slugify,
  testimonials,
  type GalleryItem,
  type Product,
} from "@/lib/bakery-data";
import { inr, menuItems, type MenuItem } from "@/lib/menu-data";
import heroCake from "@/assets/home page hero image.jpg";
import storefront from "@/assets/storefront.png";
import { Eyebrow, Logo, Magnetic, MaskedHeading, Particles, Reveal } from "./ui-bits";
import { ReelsCarousel } from "./instagram-reels";

/* ------------------------------- TYPEWRITER ------------------------------- */

const TYPEWRITER_LINES = [
  "Baked with Love",
  "Crafted Just for You",
  "Every Bite, a Memory",
];
const TYPE_SPEED = 70;
const ERASE_SPEED = 40;
const PAUSE_AFTER_TYPE = 1800;

function TypeWriter() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [erasing, setErasing] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setCursorVisible((v) => !v), 530);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const line = TYPEWRITER_LINES[lineIdx]!;

    if (!erasing) {
      if (charIdx < line.length) {
        const t = window.setTimeout(() => setCharIdx((c) => c + 1), TYPE_SPEED);
        return () => window.clearTimeout(t);
      }
      const t = window.setTimeout(() => setErasing(true), PAUSE_AFTER_TYPE);
      return () => window.clearTimeout(t);
    }

    if (charIdx > 0) {
      const t = window.setTimeout(() => setCharIdx((c) => c - 1), ERASE_SPEED);
      return () => window.clearTimeout(t);
    }

    setErasing(false);
    setLineIdx((i) => (i + 1) % TYPEWRITER_LINES.length);
  }, [charIdx, erasing, lineIdx]);

  return (
    <span className="font-display">
      <span>{TYPEWRITER_LINES[lineIdx]!.slice(0, charIdx)}</span>
      <span
        className={`ml-0.5 inline-block w-[3px] align-middle bg-gold ${
          cursorVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: "1.1em" }}
      />
    </span>
  );
}

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
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/20 to-transparent" />

      <Particles count={22} tone="gold" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-96 w-96 rounded-full bg-rose-gold/20 blur-3xl" />

      <motion.div
        style={{ y: yText, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pb-24 pt-36 md:px-12"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm uppercase tracking-[0.35em] text-primary"
        >
          Nutty Delight Bakery
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight text-cream md:text-7xl"
        >
          <TypeWriter />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 max-w-lg text-base leading-relaxed text-cream/80 md:text-lg"
        >
          Handcrafted cakes, pastries &amp; desserts made with the finest ingredients.
          Every creation is a little piece of happiness.
        </motion.p>


      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.4em] text-cream/60">
        <span className="animate-float-soft inline-block">Scroll</span>
      </div>
    </section>
  );
}

/* ---------------------------- CATEGORIES ---------------------------- */

const cakeItems = menuItems.filter((m) => m.categorySlug === "cakes");

function CategoryTile({ c, offset }: { c: MenuItem; offset: number }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIdx((v) => v + 1), 3000);
    return () => window.clearInterval(id);
  }, []);

  const cake = cakeItems[(offset + idx) % cakeItems.length]!;
  const src = cake.image;

  return (
    <Link
      to="/menu"
      search={{ category: c.categorySlug }}
      className="group relative block h-72 w-56 shrink-0 overflow-hidden rounded-[2rem] shadow-soft silk transition-all duration-500 hover:shadow-lift"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={src}
          src={src}
          alt={cake.name}
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
      <span className="absolute bottom-5 left-5 font-display text-xl text-cream">{cake.name}</span>
    </Link>
  );
}

export function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const offsetRef = useRef(0);
  const dragRef = useRef({ active: false, dragging: false, startX: 0, startY: 0, startOffset: 0 });
  const hoverDirRef = useRef<"left" | "right" | null>(null);
  const userInteracting = useRef(false);
  const userTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speed = 0.55;
  const hoverSpeed = 3;

  const tick = useCallback(() => {
    if (!dragRef.current.active) {
      const track = trackRef.current;
      if (track) {
        const half = track.scrollWidth / 2;
        let moved = false;
        if (hoverDirRef.current === "right") {
          offsetRef.current -= hoverSpeed;
          moved = true;
        } else if (hoverDirRef.current === "left") {
          offsetRef.current += hoverSpeed;
          moved = true;
        } else if (!pausedRef.current) {
          offsetRef.current -= speed;
          moved = true;
        }
        if (moved) {
          if (Math.abs(offsetRef.current) >= half) offsetRef.current += half;
          if (offsetRef.current > 0) offsetRef.current -= half;
          track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
        }
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [speed, hoverSpeed]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragRef.current = { active: true, dragging: false, startX: e.clientX, startY: e.clientY, startOffset: offsetRef.current };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.dragging) {
      if (Math.abs(dx) < 6) return;
      if (Math.abs(dy) > Math.abs(dx)) { d.active = false; return; }
      d.dragging = true;
      pausedRef.current = true;
      userInteracting.current = true;
      try { containerRef.current?.setPointerCapture(e.pointerId); } catch { /* */ }
    }
    e.preventDefault();
    offsetRef.current = d.startOffset + dx;
    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    try { containerRef.current?.releasePointerCapture(e.pointerId); } catch { /* */ }
    if (d.dragging) {
      d.dragging = false;
      if (userTimerRef.current) clearTimeout(userTimerRef.current);
      userTimerRef.current = setTimeout(() => { userInteracting.current = false; pausedRef.current = false; }, 1200);
    }
  };

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 2 && Math.abs(e.deltaX) < 2) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    pausedRef.current = true;
    userInteracting.current = true;
    const track = trackRef.current;
    if (track) {
      offsetRef.current -= delta;
      const half = track.scrollWidth / 2;
      if (Math.abs(offsetRef.current) >= half) offsetRef.current += half;
      if (offsetRef.current > 0) offsetRef.current -= half;
      track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    }
    if (userTimerRef.current) clearTimeout(userTimerRef.current);
    userTimerRef.current = setTimeout(() => { userInteracting.current = false; pausedRef.current = false; }, 1500);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => {
      if (userInteracting.current) e.preventDefault();
    };
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, []);

  return (
    <section id="categories" className="relative overflow-x-clip px-0 py-24 md:py-32">
      <div className="px-6 md:px-12">
        <Reveal>
          <Eyebrow>Browse the counter</Eyebrow>
        </Reveal>
        <MaskedHeading
          text="Every craving has a category"
          className="mt-5 max-w-3xl text-4xl text-primary md:text-6xl"
        />
      </div>

      <div
        ref={containerRef}
        className="mt-12 cursor-grab overflow-hidden active:cursor-grabbing touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
      >
        <div
          className="absolute left-0 top-0 z-[5] h-full w-1/5"
          onMouseEnter={() => { if (!userInteracting.current) hoverDirRef.current = "left"; }}
          onMouseLeave={() => { hoverDirRef.current = null; }}
        />
        <div
          className="absolute right-0 top-0 z-[5] h-full w-1/5"
          onMouseEnter={() => { if (!userInteracting.current) hoverDirRef.current = "right"; }}
          onMouseLeave={() => { hoverDirRef.current = null; }}
        />

        <div ref={trackRef} className="flex w-max gap-6">
          {[...cakeItems, ...cakeItems].map((c, i) => (
            <CategoryTile key={`${c.slug}-${i}`} c={c} offset={i} />
          ))}
        </div>
      </div>
    </section>
  );
}


/* --------------------------- PRODUCT CARDS --------------------------- */

const signatureSlugs = [
  "ferrero-hazelnut-cake",
  "chocolate-truffle-cake",
  "black-forest-cake",
  "red-velvet-cherry-cake",
  "tiramisu-cake",
  "butterscotch-praline-cake",
  "blueberry-cheesecake",
  "classic-vanilla-dream",
  "choco-drip-cake",
  "kitkat-cake",
  "pineapple-cake",
  "strawberry-cake",
  "nutella-brownie",
  "baked-nutella-cheesecake-slice",
  "biscoff-kunafa",
];

const signatureItems: Product[] = signatureSlugs
  .map((s) => menuItems.find((m) => m.slug === s))
  .filter((m): m is MenuItem => Boolean(m))
  .map((m) => ({
    name: m.name,
    category: m.category,
    categorySlug: m.categorySlug,
    note: m.note,
    price: inr(m.price),
    image: m.image,
    images: [m.image],
    badge: m.badges[0],
    slug: m.slug,
  }));

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
        className="glass group relative flex h-[26rem] w-full flex-col overflow-hidden rounded-[2rem] p-4 transition-shadow duration-500 hover:shadow-gold"
      >
        <div className="relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-cream via-peach to-cream">
          <Link
            to="/menu"
            search={{ category: p.categorySlug ?? slugify(p.category) }}
            aria-label={`View ${p.name} on the menu`}
            className="block h-full w-full"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={images[imgIdx]}
                src={images[imgIdx]}
                alt={p.name}
                loading="lazy"
                width={900}
                height={1100}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-cover object-center"
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

        <div className="flex flex-1 flex-col px-2 pb-1 pt-5">
          <span className="text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
            {p.category}
          </span>
          <h3 className="mt-2 font-display text-xl text-primary">{p.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.note}</p>
          <div className="mt-auto flex items-center justify-between pt-5">
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

/* ------------------------ SIGNATURE MENU CAROUSEL ------------------------ */

function MenuCarousel({ onQuickView }: { onQuickView: (p: Product) => void }) {
  const allItems = signatureItems;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);
  const dragRef = useRef({ active: false, dragging: false, startX: 0, startY: 0, startOffset: 0 });
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const momentumRef = useRef(false);
  const momentumRaf = useRef(0);

  useEffect(() => {
    const tick = () => {
      if (!dragRef.current.active && !momentumRef.current) {
        const track = trackRef.current;
        if (track) {
          const maxScroll = -(track.scrollWidth - containerRef.current!.clientWidth);
          offsetRef.current = Math.max(maxScroll, Math.min(0, offsetRef.current));
          track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const startMomentum = () => {
    momentumRef.current = true;
    const decay = () => {
      velocityRef.current *= 0.95;
      if (Math.abs(velocityRef.current) < 0.5) {
        momentumRef.current = false;
        return;
      }
      offsetRef.current += velocityRef.current;
      const track = trackRef.current;
      if (track) {
        const maxScroll = -(track.scrollWidth - containerRef.current!.clientWidth);
        offsetRef.current = Math.max(maxScroll, Math.min(0, offsetRef.current));
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      momentumRaf.current = requestAnimationFrame(decay);
    };
    cancelAnimationFrame(momentumRaf.current);
    momentumRaf.current = requestAnimationFrame(decay);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    cancelAnimationFrame(momentumRaf.current);
    momentumRef.current = false;
    velocityRef.current = 0;
    dragRef.current = { active: true, dragging: false, startX: e.clientX, startY: e.clientY, startOffset: offsetRef.current };
    lastXRef.current = e.clientX;
    lastTimeRef.current = Date.now();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.dragging) {
      if (Math.abs(dx) < 4) return;
      if (Math.abs(dy) > Math.abs(dx)) { d.active = false; return; }
      d.dragging = true;
      try { containerRef.current?.setPointerCapture(e.pointerId); } catch { /* */ }
    }
    e.preventDefault();
    const now = Date.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      velocityRef.current = (e.clientX - lastXRef.current) / dt * 16;
    }
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;

    offsetRef.current = d.startOffset + dx;
    const track = trackRef.current;
    if (track) {
      const maxScroll = -(track.scrollWidth - containerRef.current!.clientWidth);
      offsetRef.current = Math.max(maxScroll - 80, Math.min(80, offsetRef.current));
      track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    try { containerRef.current?.releasePointerCapture(e.pointerId); } catch { /* */ }
    if (d.dragging) {
      d.dragging = false;
      startMomentum();
    }
  };

  const onWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 2 && Math.abs(e.deltaX) < 2) return;
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    cancelAnimationFrame(momentumRaf.current);
    momentumRef.current = false;
    offsetRef.current -= delta * 1.5;
    const track = trackRef.current;
    if (track) {
      const maxScroll = -(track.scrollWidth - containerRef.current!.clientWidth);
      offsetRef.current = Math.max(maxScroll, Math.min(0, offsetRef.current));
      track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
    }
  }, []);

  return (
    <div className="py-24 md:py-32">
      <div
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div ref={trackRef} className="flex gap-8 w-max">
          {allItems.map((p, i) => (
            <div key={`${p.name}-${i}`} className="shrink-0 w-[16.5rem] sm:w-[17.5rem] md:w-[19rem]">
              <ProductCard p={p} i={i} onQuickView={onQuickView} />
            </div>
          ))}
          <div className="shrink-0 w-[16.5rem] sm:w-[17.5rem] md:w-[19rem]">
            <Link
              to="/menu"
              search={{ category: "all" }}
              className="flex h-full min-h-[26rem] flex-col items-center justify-center gap-5 rounded-[2rem] border border-dashed border-primary/20 bg-gradient-to-br from-primary/[0.06] via-transparent to-gold/10 p-8 text-center transition-all duration-500 hover:border-primary/40 hover:shadow-gold"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-gold transition-transform duration-500 hover:scale-110">
                <Cake className="h-7 w-7" />
              </span>
              <span className="font-display text-2xl text-primary">Go to Menu</span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                Explore all our signatures,<br />cakes & more
              </span>
              <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105">
                View Full Menu
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Menu() {
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <section id="menu" className="relative w-full">
      <div className="relative bg-[#8F1D2C]">
        <span
          aria-hidden
          className="absolute inset-y-0 right-0 w-1 bg-[#1C1013]"
        />
        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="grid items-end gap-10 lg:grid-cols-2">
            <div>
              <Reveal>
                <span className="flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-cream/80">
                  <span className="h-px w-10 bg-cream/50" />
                  The Signature Menu
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-4 font-display text-xl leading-[1.05] text-cream md:text-3xl lg:text-4xl">
                  <span className="block">Baked to order,</span>
                  <span className="block">never in bulk</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-sm text-sm leading-relaxed text-cream/80">
                Ten signatures on the counter every day, plus fully bespoke designs for weddings and
                celebrations.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <MenuCarousel onQuickView={setQuick} />

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
  return (
    <section className="relative overflow-hidden cocoa-surface py-24 md:py-32">
      <Particles count={20} tone="gold" />
      <div className="px-6 md:px-12">
        <Eyebrow>Most loved</Eyebrow>
        <MaskedHeading text="This week's best sellers" className="mt-5 text-4xl text-cream md:text-6xl" />
      </div>
      <Reveal className="mt-12">
        <ReelsCarousel />
      </Reveal>
    </section>
  );
}

/* ------------------------------ ABOUT ------------------------------ */

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[5fr_7fr]">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem]">
            <img
              src={storefront}
              alt="Nutty Delight Bakery storefront lit up at night with outdoor seating"
              loading="lazy"
              width={1600}
              height={1200}
              className="w-full object-cover shadow-lift"
            />
            <div className="glass absolute bottom-4 left-4 flex items-center gap-4 rounded-[1.8rem] p-4 shadow-lift md:left-6 md:bottom-6 md:p-5">
              <Logo className="h-14 w-14 rounded-full md:h-16 md:w-16" />
              <div>
                <p className="font-display text-base text-primary md:text-lg">By Vithika</p>
                <p className="text-[0.65rem] tracking-widest text-muted-foreground md:text-xs">HEAD PASTRY CHEF</p>
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
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Nutty Delight began with one oven, one whisk and a stubborn belief that a cake should taste
              as beautiful as it looks. Today Vithika and her small team bake every order by hand —
              no premixes, no shortcuts, no compromise on butter.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              From single-tier birthday cakes to hundred-guest wedding centrepieces, each design starts
              with a conversation and ends with a bite you remember.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Award, t: "Award-winning", s: "Best patisserie 2024" },
              { icon: Leaf, t: "Pure ingredients", s: "No preservatives" },
              { icon: Sparkles, t: "Custom design", s: "Made for your day" },
            ].map(({ icon: Icon, t, s }) => (
              <div key={t} className="glass rounded-[1.5rem] p-6">
                <Icon className="h-6 w-6 text-gold" />
                <p className="mt-4 font-display text-lg text-primary">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

/* ----------------------------- GALLERY ----------------------------- */

const customCakeGallery: GalleryItem[] = menuItems
  .filter((m) => m.name === "Custom Cake")
  .map((m) => ({
    src: m.image,
    alt: m.note,
  }));

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <Eyebrow>From the counter</Eyebrow>
        </Reveal>
        <MaskedHeading text="A gallery of good mornings" className="mt-5 text-4xl text-primary md:text-6xl" />

        <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {customCakeGallery.map((g, i) => (
            <Reveal key={g.alt} delay={(i % 3) * 0.06}>
              <div className="group relative block w-full overflow-hidden rounded-[1.8rem] shadow-soft">
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="absolute bottom-4 left-4 text-left font-display text-sm text-primary opacity-0 transition-opacity duration-300 hover:text-gold hover:underline group-hover:opacity-100"
                >
                  View
                </button>
              </div>
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
              src={customCakeGallery[open]!.src}
              alt={customCakeGallery[open]!.alt}
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
      <div className="text-center">
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
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] cocoa-surface px-8 py-16 text-center md:px-16 md:py-20">
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
      </div>
    </section>
  );
}

/* ---------------------------- INSTAGRAM ---------------------------- */

const beverageFeed = menuItems
  .filter((m) => m.categorySlug === "beverages" || m.slug === "mango-shake")
  .map((m) => ({ src: m.image, name: m.name }));

export function InstagramFeed() {
  return (
    <section className="pb-24">
      <div className="text-center">
        <Reveal>
          <Eyebrow>@nuttydelight.bakery</Eyebrow>
        </Reveal>
        <MaskedHeading text="Fresh from our feed" className="mt-5 text-4xl text-primary md:text-5xl" />

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {beverageFeed.map((b, i) => (
            <Reveal key={b.src} delay={i * 0.05}>
              <div
                className="group relative block aspect-square overflow-hidden rounded-[1.4rem]"
              >
                <img
                  src={b.src}
                  alt={`${b.name} from Nutty Delight bakery`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-115"
                />
                <span className="absolute inset-0 grid place-items-center bg-espresso/45 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <Heart className="h-6 w-6 text-cream transition-transform duration-500 group-hover:scale-125 group-hover:fill-cream" />
                </span>
              </div>
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
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2">
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
                  Rajat Jayanti Complex, Kushabhau Thakre Marg, Ganesh Nagar, Vijay Nagar, A-16, Scheme No 54, Indore, Madhya Pradesh 452010 — open in Google Maps for live directions.
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
                <a href="https://wa.me/918770941861" className="text-muted-foreground hover:text-primary">
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
      </div>
    </section>
  );
}
