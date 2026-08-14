import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: { process: () => void };
    };
  }
}

const REELS = [
  "https://www.instagram.com/reel/DbvbMJGOYHl/",
  "https://www.instagram.com/reel/Dba05g4uSw-/",
  "https://www.instagram.com/reel/DbI3XlEMs6q/",
  "https://www.instagram.com/reel/DaQJ8s2sMHB/",
  "https://www.instagram.com/reel/DY7DkRTud1_/",
  "https://www.instagram.com/reel/DY1u636uio3/",
  "https://www.instagram.com/reel/DYo6tBku3eb/",
  "https://www.instagram.com/reel/DYPb41qO49w/",
  "https://www.instagram.com/reel/DX3Y6eUubTD/",
  "https://www.instagram.com/reel/DWs3FT7kwoS/",
  "https://www.instagram.com/reel/DV-Kyv-uQIx/",
  "https://www.instagram.com/reel/DVYuVFJiGQv/",
  "https://www.instagram.com/reel/DSZC1EADOO_/",
  "https://www.instagram.com/reel/DN-q3YEkw7R/",
  "https://www.instagram.com/reel/DNxSgouZqqd/",
  "https://www.instagram.com/reel/DNpYDbDM17I/",
  "https://www.instagram.com/reel/DIMjLXTTbDv/",
];

const WHEEL_STEP_PX = 60;
const WHEEL_COOLDOWN_MS = 500;

function permalink(url: string) {
  return `${url}?utm_source=ig_embed&utm_campaign=loading`;
}

function buildEmbedHtml(url: string) {
  const link = permalink(url);
  return `
<blockquote class="instagram-media" data-instgrm-permalink="${link}" data-instgrm-version="14">
  <a href="${link}" target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
</blockquote>
`.trim();
}

function loadInstagramEmbedScript() {
  if (window.instgrm || document.getElementById("instagram-embed-js")) return;
  const script = document.createElement("script");
  script.id = "instagram-embed-js";
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  document.body.appendChild(script);
}

function processEmbeds() {
  let tries = 0;
  const interval = window.setInterval(() => {
    tries += 1;
    if (window.instgrm && window.instgrm.Embeds) {
      window.clearInterval(interval);
      try {
        window.instgrm.Embeds.process();
      } catch {
        /* ignore */
      }
      return;
    }
    if (tries > 200) window.clearInterval(interval);
  }, 100);
}

function ReelSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1rem] bg-cream">
      <div className="reel-shimmer absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/80 text-primary shadow-soft backdrop-blur-sm">
          <Play className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

const StaticEmbed = memo(function StaticEmbed({ html }: { html: string }) {
  return <div className="reel-embed h-full w-full" dangerouslySetInnerHTML={{ __html: html }} />;
});

function ReelEmbed({
  url,
  html,
  onWheelCapture,
}: {
  url: string;
  html: string;
  onWheelCapture: (e: React.WheelEvent) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    processEmbeds();
  }, [html]);

  useEffect(() => {
    const root = rootRef.current;
    const started = Date.now();
    let timer: number | undefined;
    const tick = () => {
      if (!root) return;
      if (root.querySelector("iframe")) {
        setStalled(false);
        return;
      }
      setStalled(Date.now() - started > 12000);
      timer = window.setTimeout(tick, 1000);
    };
    timer = window.setTimeout(tick, 1500);
    return () => window.clearTimeout(timer);
  }, [html]);

  const stop = (e: React.WheelEvent) => {
    e.stopPropagation();
    onWheelCapture(e);
  };

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1rem] bg-white">
      <div ref={rootRef} className="h-full w-full">
        <StaticEmbed html={html} />
      </div>
      <div className="absolute inset-x-0 top-0 z-10 h-16" onWheel={stop} />
      <div className="absolute inset-x-0 bottom-0 z-10 h-16" onWheel={stop} />
      <div className="absolute inset-y-0 left-0 z-10 w-10" onWheel={stop} />
      <div className="absolute inset-y-0 right-0 z-10 w-10" onWheel={stop} />
      {stalled && (
        <button
          type="button"
          onClick={() => window.open(permalink(url), "_blank", "noopener")}
          aria-label="View reel on Instagram"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-espresso/60 backdrop-blur-sm transition-colors duration-300 hover:bg-espresso/70"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-primary shadow-soft">
            <Play className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-sm font-medium tracking-wide text-white">
            View on Instagram
          </span>
        </button>
      )}
    </div>
  );
}

function ReelCard({
  url,
  active,
  onWheelCapture,
}: {
  url: string;
  active: boolean;
  onWheelCapture: (e: React.WheelEvent) => void;
}) {
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!active || embedHtml) return undefined;
    const tryInject = () => {
      if (window.instgrm && window.instgrm.Embeds) {
        setEmbedHtml(buildEmbedHtml(url));
        return true;
      }
      return false;
    };
    if (tryInject()) return undefined;
    let tries = 0;
    const interval = window.setInterval(() => {
      tries += 1;
      if (tryInject()) {
        clearInterval(interval);
      } else if (tries > 200) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [active, embedHtml, url]);

  return (
    <div className="reel-card h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-soft">
      {embedHtml ? (
        <ReelEmbed url={url} html={embedHtml} onWheelCapture={onWheelCapture} />
      ) : (
        <div className="aspect-[4/5] w-full">
          <ReelSkeleton />
        </div>
      )}
    </div>
  );
}

export function ReelsCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const [viewportW, setViewportW] = useState(0);
  const [dragPos, setDragPos] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const indexRef = useRef(0);
  const perViewRef = useRef(perView);
  const hoveredRef = useRef(false);
  const wheelRef = useRef({ acc: 0, cooldown: 0 });
  const dragRef = useRef({ active: false, dragging: false, startX: 0, startPos: 0 });
  const dragPosRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    perViewRef.current = perView;
  }, [perView]);

  useEffect(() => {
    loadInstagramEmbedScript();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setReady(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setReady(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const update = () => {
      const w = el.clientWidth;
      const pv = w < 640 ? 1 : w < 1024 ? 2 : 3;
      setPerView(pv);
      setViewportW(w);
      setIndex((i) => Math.min(i, REELS.length - pv));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const step = perView > 0 ? viewportW / perView : 0;
  const maxIndex = Math.max(0, REELS.length - perView);
  const maxScroll = maxIndex * step;
  const pos =
    dragPos !== null
      ? Math.min(Math.max(dragPos, 0), maxScroll)
      : Math.min(index * step, maxScroll);

  const goBy = useCallback((delta: number) => {
    setIndex((i) => Math.min(Math.max(i + delta, 0), REELS.length - perViewRef.current));
  }, []);

  const goTo = useCallback((target: number) => {
    setIndex(Math.min(Math.max(target, 0), REELS.length - perViewRef.current));
  }, []);

  const stepWheel = useCallback(
    (e: WheelEvent) => {
      const el = viewportRef.current;
      if (!el || !hoveredRef.current) return;
      const now = Date.now();
      if (now < wheelRef.current.cooldown) {
        e.preventDefault();
        return;
      }

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= el.clientHeight;
      if (Math.abs(delta) < 8) return;

      const goingUp = delta < 0;
      const atTop = indexRef.current <= 0;
      const atEnd = indexRef.current >= REELS.length - perViewRef.current;

      if ((atTop && goingUp) || (atEnd && !goingUp)) {
        wheelRef.current.acc = 0;
        return;
      }

      e.preventDefault();
      wheelRef.current.acc += delta;
      if (wheelRef.current.acc >= WHEEL_STEP_PX) {
        wheelRef.current.acc = 0;
        wheelRef.current.cooldown = now + WHEEL_COOLDOWN_MS;
        goBy(1);
      } else if (wheelRef.current.acc <= -WHEEL_STEP_PX) {
        wheelRef.current.acc = 0;
        wheelRef.current.cooldown = now + WHEEL_COOLDOWN_MS;
        goBy(-1);
      }
    },
    [goBy],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;
    const onWheel = (e: WheelEvent) => stepWheel(e);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [stepWheel]);

  const onWheelCapture = useCallback(
    (e: React.WheelEvent) => stepWheel(e.nativeEvent),
    [stepWheel],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = viewportRef.current;
    if (!el) return;
    dragRef.current.active = true;
    dragRef.current.dragging = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startPos = indexRef.current * step;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.dragging) {
      if (Math.abs(dx) < 8) return;
      d.dragging = true;
      setDragging(true);
      try {
        viewportRef.current?.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    dragPosRef.current = d.startPos - dx;
    setDragPos(dragPosRef.current);
  };

  const endDrag = () => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (d.dragging) {
      d.dragging = false;
      setDragging(false);
      const target = Math.round(dragPosRef.current / step);
      goTo(target);
      setDragPos(null);
    }
  };

  return (
    <div ref={sectionRef} className="relative">
      <div
        ref={viewportRef}
        className="cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
        onMouseEnter={() => (hoveredRef.current = true)}
        onMouseLeave={() => (hoveredRef.current = false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          ref={trackRef}
          className="flex items-stretch"
          style={{
            transform: `translate3d(${-pos}px, 0, 0)`,
            transition: dragging
              ? "none"
              : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {REELS.map((url) => (
            <div
              key={url}
              className="shrink-0 pr-3 sm:pr-4 lg:pr-6"
              style={{ width: step || undefined }}
            >
              <ReelCard url={url} active={ready} onWheelCapture={onWheelCapture} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goBy(-1)}
          disabled={index <= 0}
          aria-label="Previous reels"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-primary/15 bg-white text-primary shadow-soft transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-primary/15 disabled:bg-white disabled:text-primary/40 disabled:hover:bg-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => goBy(1)}
          disabled={index >= maxIndex}
          aria-label="Next reels"
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-primary/15 bg-white text-primary shadow-soft transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:border-primary/15 disabled:bg-white disabled:text-primary/40 disabled:hover:bg-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
