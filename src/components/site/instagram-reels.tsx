import { memo, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

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

function ReelSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] bg-primary/20">
      <div className="reel-shimmer absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/90 text-primary shadow-gold">
          <Play className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

const StaticEmbed = memo(function StaticEmbed({ html }: { html: string }) {
  return <div className="reel-embed w-full" dangerouslySetInnerHTML={{ __html: html }} />;
});

function ReelEmbed({ url, html }: { url: string; html: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [stalled, setStalled] = useState(false);

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

  return (
    <div className="relative">
      <div ref={rootRef}>
        <StaticEmbed html={html} />
      </div>
      {stalled && (
        <button
          type="button"
          onClick={() => window.open(permalink(url), "_blank", "noopener")}
          aria-label="View reel on Instagram"
          className="absolute inset-0 z-10 grid place-items-center bg-espresso/60 transition-colors duration-300 hover:bg-espresso/70"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/95 text-primary shadow-gold">
            <Play className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="mt-3 block text-sm font-medium tracking-wide text-cream">
            View on Instagram
          </span>
        </button>
      )}
    </div>
  );
}

function ReelCard({ url, active }: { url: string; active: boolean }) {
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
    const interval = window.setInterval(() => {
      if (tryInject()) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, [active, embedHtml, url]);

  return (
    <div className="reel-card relative h-full w-full overflow-hidden rounded-[1.5rem] border border-gold/15 bg-white/[0.05] p-2 shadow-soft">
      {embedHtml ? (
        <ReelEmbed url={url} html={embedHtml} />
      ) : (
        <div className="aspect-[4/5] w-full">
          <ReelSkeleton />
        </div>
      )}
    </div>
  );
}

export function ReelsCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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

  useEffect(() => {
    if (!ready) return undefined;
    let tries = 0;
    const interval = window.setInterval(() => {
      tries += 1;
      if (window.instgrm && window.instgrm.Embeds) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          try {
            window.instgrm?.Embeds?.process();
          } catch {
            /* ignore */
          }
        }, 80);
        return;
      }
      if (tries > 200) window.clearInterval(interval);
    }, 100);
    return () => window.clearInterval(interval);
  }, [ready]);

  const drag = useRef({ active: false, dragging: false, startX: 0, startY: 0, scrollLeft: 0 });
  const [dragging, setDragging] = useState(false);
  const wheelState = useRef({ target: 0, raf: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    const el = trackRef.current;
    if (!el || drag.current.active) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const s = wheelState.current;
    s.target += delta;
    if (!s.raf) {
      const step = () => {
        const t = trackRef.current;
        if (!t) return;
        const diff = s.target - t.scrollLeft;
        if (Math.abs(diff) < 0.5) {
          s.raf = 0;
          return;
        }
        t.scrollLeft += diff * 0.25;
        s.raf = window.requestAnimationFrame(step);
      };
      s.raf = window.requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener("wheel", handleWheel as unknown as EventListener, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel as unknown as EventListener);
      if (wheelState.current.raf) window.cancelAnimationFrame(wheelState.current.raf);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    const s = wheelState.current;
    if (s.raf) window.cancelAnimationFrame(s.raf);
    s.raf = 0;
    s.target = el.scrollLeft;
    drag.current.active = true;
    drag.current.dragging = false;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.scrollLeft = el.scrollLeft;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.dragging) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.dragging = true;
      setDragging(true);
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    el.scrollLeft = d.scrollLeft - dx;
  };

  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (drag.current.dragging) {
      drag.current.dragging = false;
      setDragging(false);
    }
  };

  return (
    <div ref={sectionRef} className="relative">
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={`reel-scroll -mx-6 flex cursor-grab select-none items-stretch overflow-x-auto px-6 active:cursor-grabbing md:-mx-12 md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden${
          dragging ? "" : " snap-x snap-mandatory"
        }`}
      >
        {REELS.map((url) => (
          <div key={url} className="reel-slide w-full shrink-0 snap-start pr-6 sm:w-1/2 sm:pr-6 md:pr-12 lg:w-1/3">
            <ReelCard url={url} active={ready} />
          </div>
        ))}
      </div>
    </div>
  );
}
