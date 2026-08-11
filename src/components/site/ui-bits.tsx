import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export const logoUrl = logo;

export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="Nutty Delight Bakery by Vithika logo"
      className={cn("select-none object-contain", className)}
      draggable={false}
    />
  );
}

/* ---------------- Scroll reveal ---------------- */

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  scale?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, y = 44, blur = true, scale = 1, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -8% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale, filter: blur ? "blur(14px)" : "blur(0px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
          : { opacity: 0, y, scale, filter: blur ? "blur(14px)" : "blur(0px)" }
      }
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MaskedHeading({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <h2 ref={ref} className={cn("font-display", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-muted-foreground">
      <span className="h-px w-8 bg-gold" />
      {children}
    </span>
  );
}

/* ---------------- Magnetic button ---------------- */

export function Magnetic({
  children,
  className,
  as = "button",
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = as === "a" ? (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      {inner}
    </motion.div>
  );
}

/* ---------------- Ambient particles ---------------- */

export function Particles({ count = 26, tone = "gold" }: { count?: number; tone?: "gold" | "flour" | "cocoa" }) {
  const [seeds, setSeeds] = useState<Array<{ l: number; s: number; d: number; dur: number }>>([]);

  useEffect(() => {
    setSeeds(
      Array.from({ length: count }, () => ({
        l: Math.random() * 100,
        s: 3 + Math.random() * 7,
        d: Math.random() * 14,
        dur: 14 + Math.random() * 16,
      })),
    );
  }, [count]);

  const toneClass =
    tone === "gold" ? "bg-gold/60" : tone === "cocoa" ? "bg-primary/35" : "bg-cream shadow-soft";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((p, i) => (
        <span
          key={i}
          className={cn("absolute bottom-[-10vh] rounded-full blur-[1px] animate-drift", toneClass)}
          style={{
            left: `${p.l}%`,
            width: p.s,
            height: p.s,
            animationDelay: `${p.d}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- Custom cursor + sparkle trail ---------------- */

export function CursorFX() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let mx = rx;
    let my = ry;
    let raf = 0;
    let last = 0;

    const sparkle = (x: number, y: number) => {
      const s = document.createElement("span");
      s.className = "ndb-sparkle";
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      document.body.appendChild(s);
      window.setTimeout(() => s.remove(), 700);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      const t = performance.now();
      if (t - last > 70) {
        last = t;
        sparkle(mx, my);
      }
      const target = e.target as HTMLElement | null;
      const hot = !!target?.closest("a, button, [data-cursor='hover']");
      ring.current?.classList.toggle("is-hot", hot);
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("ndb-cursor-on");

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("ndb-cursor-on");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        .ndb-cursor-on, .ndb-cursor-on * { cursor: none !important; }
        .ndb-sparkle{position:fixed;width:6px;height:6px;border-radius:9999px;pointer-events:none;z-index:9998;
          background:radial-gradient(circle, var(--gold) 0%, transparent 70%);
          animation: ndb-spark .7s var(--ease-silk) forwards;}
        @keyframes ndb-spark{0%{opacity:.9;transform:translate(-50%,-50%) scale(1)}
          100%{opacity:0;transform:translate(-50%,-140%) scale(.2)}}
        .ndb-ring{transition:width .3s var(--ease-silk),height .3s var(--ease-silk),background .3s;}
        .ndb-ring.is-hot{width:66px;height:66px;background:color-mix(in oklab, var(--gold) 22%, transparent);}
      `}</style>
      <div
        ref={ring}
        className="ndb-ring pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-gold/70"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-primary"
      />
    </>
  );
}

/* ---------------- Preloader ---------------- */

export function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 13 + 4;
        return next >= 100 ? 100 : next;
      });
    }, 130);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress < 100) return undefined;
    const t = window.setTimeout(onDone, 650);
    return () => window.clearTimeout(t);
  }, [progress, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9997] flex flex-col items-center justify-center warm-surface"
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <Particles count={30} tone="flour" />
      <motion.div
        initial={{ scale: 0.86, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-gold/25 blur-3xl" />
        <Logo className="h-40 w-40 animate-float-soft rounded-full md:h-52 md:w-52" />
      </motion.div>

      <p className="mt-8 font-display text-lg tracking-wide text-primary">Warming the ovens…</p>

      <div className="mt-5 h-[3px] w-56 overflow-hidden rounded-full bg-primary/15">
        <div
          className="h-full shimmer-gold transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-3 text-xs tracking-[0.4em] text-muted-foreground">
        {Math.round(progress)}%
      </span>
    </motion.div>
  );
}

/* ---------------- Social icons ---------------- */

export function Instagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Facebook({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
