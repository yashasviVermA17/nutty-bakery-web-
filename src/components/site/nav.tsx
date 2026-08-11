import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Moon, Sun, ShoppingBag } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Logo, Magnetic, Instagram, Facebook } from "./ui-bits";
import { useCart } from "@/lib/cart";

function NavItem({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (href === "/menu") {
    return (
      <Link to="/menu" search={{ category: "all" }} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (pathname !== "/") {
    return (
      <Link to="/" hash={href.replace("#", "")} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

const links = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "/menu" },
  { label: "Categories", href: "#categories" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const { scrollY } = useScroll();
  const pad = useTransform(scrollY, [0, 200], [22, 10]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <motion.header
        style={{ paddingTop: pad, paddingBottom: pad }}
        className={`fixed inset-x-0 top-0 z-50 px-5 transition-colors duration-500 md:px-10 ${
          scrolled ? "glass" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <NavItem href="#home" className="flex items-center gap-3">
            <Logo className="h-12 w-12 rounded-full md:h-14 md:w-14" />
            <span className="hidden font-display text-lg leading-tight text-primary sm:block">
              Nutty Delight
              <span className="block text-[0.6rem] tracking-[0.35em] text-muted-foreground">
                BY VITHIKA
              </span>
            </span>
          </NavItem>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <NavItem
                  href={l.href}
                  className="group relative text-sm tracking-wide text-foreground/80 transition-colors hover:text-primary"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                </NavItem>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={`Open cart, ${count} items`}
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-primary transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full shimmer-gold px-1 text-[0.6rem] font-bold text-espresso">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={() => setDark((d) => !d)}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-primary transition-colors hover:bg-accent"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Magnetic
              as="a"
              href="/#contact"
              className="hidden rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground shadow-soft transition-transform hover:scale-[1.03] md:inline-flex"
            >
              Order Now
            </Magnetic>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-primary lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 90% 6%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 90% 6%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 90% 6%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] warm-surface px-8 py-10"
          >
            <div className="flex items-center justify-between">
              <Logo className="h-16 w-16 rounded-full" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-gold/50 text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-14 space-y-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 + i * 0.07, duration: 0.6 }}
                >
                  <NavItem
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl text-primary"
                  >
                    {l.label}
                  </NavItem>
                </motion.li>
              ))}
            </ul>
            <NavItem
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-12 inline-flex rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground"
            >
              Order Now
            </NavItem>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden cocoa-surface px-6 pb-10 pt-20 text-cream md:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="h-20 w-20 rounded-full" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/70">
            Small-batch cakes, pastries and desserts baked fresh every morning by Vithika. Fall in love
            with every bite.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
              { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/919000000000" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 text-cream/80 transition-all hover:border-gold hover:text-gold"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-gold">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            {links.map((l) => (
              <li key={l.href}>
                <NavItem href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </NavItem>

              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-gold">Newsletter</h3>
          <p className="mt-5 text-sm text-cream/70">Seasonal drops and limited edition cakes.</p>
          <form
            className="mt-4 flex overflow-hidden rounded-full border border-gold/30"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              aria-label="Email address"
              className="w-full bg-transparent px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 shimmer-gold px-5 text-xs font-medium uppercase tracking-widest text-espresso"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-gold/15 pt-6 text-xs text-cream/50 md:flex-row">
        <span>© {new Date().getFullYear()} Nutty Delight Bakery by Vithika. All rights reserved.</span>
        <span>Fall in love with every bite.</span>
      </div>
    </footer>
  );
}
