import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./ui-bits";

const TOTAL_DURATION = 2800;
const HOLD_AFTER_100 = 400;
const FADE_OUT_DURATION = 600;

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / TOTAL_DURATION, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), HOLD_AFTER_100);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_DURATION / 1000, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "linear-gradient(160deg, oklch(0.98 0.016 73.7) 0%, oklch(0.955 0.03 60) 50%, oklch(0.98 0.016 73.7) 100%)",
          }}
        >
          {/* Soft floating light orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full opacity-30"
              style={{ background: "radial-gradient(circle, oklch(0.92 0.04 75) 0%, transparent 70%)" }}
            />
            <motion.div
              animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle, oklch(0.90 0.05 60) 0%, transparent 70%)" }}
            />
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center px-6">
            {/* Logo with glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div
                className="pointer-events-none absolute inset-0 -m-6 rounded-full opacity-40 blur-2xl"
                style={{ background: "radial-gradient(circle, oklch(0.90 0.06 75) 0%, transparent 70%)" }}
              />
              <div className="relative h-24 w-24 overflow-hidden rounded-full md:h-32 md:w-32">
                <Logo className="h-full w-full object-cover" />
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
              className="mt-8 font-display text-lg tracking-wide text-primary/70 md:text-xl"
            >
              Warming the ovens…
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 w-48 md:w-64"
            >
              <div className="h-[2px] w-full overflow-hidden rounded-full bg-primary/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg, oklch(0.85 0.06 65), oklch(0.75 0.09 75))",
                  }}
                />
              </div>
              <p className="mt-3 text-center font-display text-xs tracking-[0.2em] text-primary/50">
                {Math.round(progress * 100)}%
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
