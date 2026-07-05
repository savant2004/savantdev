import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { scrollToId } from '../../hooks/useSmoothScroll';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useContactModal } from '../../lib/contactContext';
import { Button } from '../foundation/Button';

// Nav items map labels to in-page section ids. ABOUT → #system (the
// "What We Do / how SAVANT thinks" section is the closest to an About).
const NAV_LINKS = [
  { id: 'top', label: 'HOME' },
  { id: 'work', label: 'WORK' },
  { id: 'system', label: 'ABOUT' },
  { id: 'journey', label: 'JOURNEY' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

/** Floating dock navbar — Linear/Framer/Arc inspired pill that floats at the
 * top, becomes a glass panel on scroll, and slides a pink glow between items. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const active = useActiveSection(SECTION_IDS);
  const lastY = useRef(0);
  const { setOpen } = useContactModal();

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 40);
    setHidden(v > lastY.current && v > 360);
    lastY.current = v;
  });

  // The glow tracks the hovered item, falling back to the active one.
  const glowTarget = hovered ?? active;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      <nav
        className={cn(
          'flex h-12 items-center justify-between gap-1 rounded-full px-2 pl-4 transition-all duration-500 sm:h-16 sm:gap-2 sm:px-2.5 sm:pl-5',
          // 900px dock, capped to viewport on small screens
          'w-[min(900px,calc(100vw-2rem))]',
          scrolled
            ? 'glass-strong shadow-card border border-primary/15'
            : 'border border-transparent bg-bg/30 backdrop-blur-md',
        )}
      >
        {/* Left slot — logo */}
        <button
          onClick={() => scrollToId('top')}
          className="group flex shrink-0 items-center gap-1.5 sm:gap-2.5"
        >
          <span className="relative flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8">
            <span className="absolute inset-0 rounded-md bg-crimson-flame opacity-80 blur-[6px] transition-opacity group-hover:opacity-100" />
            <span className="relative font-hero text-base font-bold text-white sm:text-lg">
              S
            </span>
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-text sm:text-lg">
            SAVANT
          </span>
        </button>

        {/* Center slot — nav links with sliding glow */}
        <div
          className="relative hidden items-center md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = glowTarget === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToId(link.id)}
                onMouseEnter={() => setHovered(link.id)}
                className={cn(
                  'relative rounded-full px-4 py-2 font-body text-[13px] font-medium tracking-wide transition-colors duration-300',
                  isActive ? 'text-white' : 'text-muted hover:text-text',
                )}
              >
                {/* Sliding pink glow (shared layout element) */}
                {isActive && (
                  <motion.span
                    layoutId="nav-glow"
                    className="absolute inset-0 -z-10 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(255,176,0,0.28), rgba(220,20,60,0.12) 70%, transparent)',
                    boxShadow: '0 0 24px rgba(255,176,0,0.35)',
                    }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right slot — CTA */}
        <Button
          variant="primary"
          size="md"
          magnetic
          className="h-9 shrink-0 px-3 text-xs sm:h-11 sm:px-5 sm:text-sm"
          onClick={() => setOpen(true)}
        >
          Let's Connect
        </Button>
      </nav>
    </motion.header>
  );
}

/** Animated scroll cue — draws an SVG line downward on a loop. Exported from
 * here so Hero keeps its existing import path. */
export function ScrollIndicator() {
  const { scrollY } = useScroll();
  const [opacity, setOpacity] = useState(1);
  const [short, setShort] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setOpacity(v > 100 ? 0 : 1));

  useEffect(() => {
    const check = () => setShort(window.innerHeight < 700);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <AnimatePresence>
      {opacity > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          exit={{ opacity: 0 }}
          onClick={() => scrollToId('ecosystem')}
          className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          aria-label="Scroll down"
        >
          {!short && (
            <span className="font-body text-[10px] uppercase tracking-[0.3em] text-muted">
              Scroll
            </span>
          )}
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <rect x="2" y="2" width="20" height="36" rx="10" stroke="url(#scroll-grad)" strokeWidth="1.5" />
            <circle cx="12" cy="14" r="3" fill="#FFB000">
              <animate attributeName="cy" values="14;26;14" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <defs>
              <linearGradient id="scroll-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC143C" />
                <stop offset="100%" stopColor="#FFB000" />
              </linearGradient>
            </defs>
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
