import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { SectionShell, SectionEyebrow, SectionTitle } from '../foundation/SectionShell';
import { StatBar } from '../ui/StatBar';
import { Badge } from '../foundation/Badge';
import { ecosystemStats } from '../../data/stats';
import { EASE } from '../../lib/utils';

// Six ecosystem modules per the spec.
const MODULES = [
  { label: 'Customer App', desc: 'Booking & live tracking', icon: '◉' },
  { label: 'Driver App', desc: 'Routes & earnings', icon: '◈' },
  { label: 'Picker App', desc: 'Order fulfilment', icon: '◆' },
  { label: 'Dispatcher Panel', desc: 'Fleet coordination', icon: '▣' },
  { label: 'Admin Dashboard', desc: 'Governance & analytics', icon: '▲' },
  { label: 'POS System', desc: 'In-store checkout', icon: '✦' },
];

const IMAGES = [
  { src: '/mk-dk.png', alt: 'MetroKent DK', isFull: false },
  { src: '/mk-mobo-1.jpeg', alt: 'Customer App', isFull: true },
  { src: '/mk-mobo-2.png', alt: 'Ops App', isFull: true },
];

export function FeaturedEcosystem() {
  const devicesRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const selected = currentIndex !== null ? IMAGES[currentIndex] : null;
  // Scroll-driven parallax: phones drift apart on X / Z as the section passes.
  const { scrollYProgress } = useScroll({
    target: devicesRef,
    offset: ['start end', 'end start'],
  });
  const phoneLeftX = useTransform(scrollYProgress, [0, 1], [-40, -80]);
  const phoneLeftRot = useTransform(scrollYProgress, [0, 1], [-8, -14]);
  const phoneRightX = useTransform(scrollYProgress, [0, 1], [40, 80]);
  const phoneRightRot = useTransform(scrollYProgress, [0, 1], [8, 14]);
  const laptopY = useTransform(scrollYProgress, [0, 1], [60, -40]);

  const close = useCallback(() => setCurrentIndex(null), []);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i !== null ? (i - 1 + IMAGES.length) % IMAGES.length : null));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i !== null ? (i + 1) % IMAGES.length : null));
  }, []);

  const prevIndex = currentIndex !== null ? (currentIndex - 1 + IMAGES.length) % IMAGES.length : null;
  const nextIndex = currentIndex !== null ? (currentIndex + 1) % IMAGES.length : null;

  useEffect(() => {
    if (currentIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, close, prev, next]);

  return (
    <SectionShell id="ecosystem">
      <div className="grid items-center gap-8 lg:grid-cols-[420px_1fr] lg:gap-12">
        {/* LEFT — story + modules */}
        <div>
          <SectionEyebrow>Featured Ecosystem</SectionEyebrow>
          <SectionTitle>
            MetroKent
            <span className="block text-gradient">in production.</span>
          </SectionTitle>
          <p className="mt-6 font-body text-lg leading-relaxed text-muted">
            One logistics backbone powering six surfaces. Customers book,
            drivers navigate, pickers fulfil, dispatchers coordinate, admins
            govern, and stores check out — all on a single realtime core built
            to scale.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {MODULES.map((mod, i) => (
              <motion.div
                key={mod.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 text-sm text-crimson-500">{mod.icon}</span>
                <div>
                  <div className="font-display text-sm font-semibold text-text">
                    {mod.label}
                  </div>
                  <div className="font-body text-xs text-muted">{mod.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            <Badge tone="default">WebSocket realtime</Badge>
            <Badge tone="default">Horizontal scale</Badge>
          </div>
        </div>

        {/* RIGHT — images with scroll-driven 3D separation */}
        <div
          ref={devicesRef}
          className="relative flex min-h-[480px] items-center justify-center max-md:min-h-[320px]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(220,20,60,0.25),transparent_60%)]" />

          <div className="relative flex w-full items-center justify-center">
            {/* mk-dk — main large image back-center */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ y: laptopY }}
              className="z-10 w-full max-w-[640px]"
            >
              <button
                type="button"
                onClick={() => setCurrentIndex(0)}
                className="w-full text-left"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  className="overflow-hidden rounded-2xl border border-primary/30 shadow-card"
                >
                  <img
                    src="/mk-dk.png"
                    alt="MetroKent DK"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </button>
            </motion.div>

            {/* mk-mobo-1 — offset bottom-left — Customer app */}
            <motion.div
              className="absolute bottom-0 left-2 z-20 w-[35%] max-w-[200px] sm:left-4 sm:w-[30%]"
              style={{ x: phoneLeftX, rotate: phoneLeftRot }}
            >
              <button
                type="button"
                onClick={() => setCurrentIndex(1)}
                className="w-full text-left"
              >
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="overflow-hidden rounded-2xl border border-primary/30 shadow-card"
                >
                  <img
                    src="/mk-mobo-1.jpeg"
                    alt="Customer App"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </button>
            </motion.div>

            {/* mk-mobo-2 — offset top-right — Ops app */}
            <motion.div
              className="absolute right-2 top-4 z-20 w-[35%] max-w-[200px] sm:right-4 sm:w-[30%]"
              style={{ x: phoneRightX, rotate: phoneRightRot }}
            >
              <button
                type="button"
                onClick={() => setCurrentIndex(2)}
                className="w-full text-left"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="overflow-hidden rounded-2xl shadow-card"
                >
                  <img
                    src="/mk-mobo-2.png"
                    alt="Ops App"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-20"
      >
        <StatBar stats={ecosystemStats} />
      </motion.div>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl"
            onClick={close}
            onWheel={close}
            onTouchMove={(e) => {
              if (e.touches.length === 1) {
                const diff = Math.abs(e.touches[0].clientY - touchStartY.current);
                if (diff > 40) close();
              }
            }}
            onTouchStart={(e) => {
              if (e.touches.length === 1) touchStartY.current = e.touches[0].clientY;
            }}
          >
            {/* Previous peek */}
            {prevIndex !== null && (
              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute bottom-0 left-0 top-0 z-10 flex w-16 cursor-pointer items-center justify-start bg-gradient-to-r from-black/40 to-transparent p-1 transition-opacity hover:opacity-80 md:w-24 md:p-2"
              >
                <div className="h-2/3 w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
                  <img
                    src={IMAGES[prevIndex].src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.button>
            )}

            {/* Next peek */}
            {nextIndex !== null && (
              <motion.button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute bottom-0 right-0 top-0 z-10 flex w-16 cursor-pointer items-center justify-end bg-gradient-to-l from-black/40 to-transparent p-1 transition-opacity hover:opacity-80 md:w-24 md:p-2"
              >
                <div className="h-2/3 w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
                  <img
                    src={IMAGES[nextIndex].src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.button>
            )}

            {/* Main image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex h-screen w-screen items-center justify-center p-4 md:p-12"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                const abs = Math.abs(info.offset.x);
                if (abs > 50) {
                  if (info.offset.x > 0) prev();
                  else next();
                } else {
                  close();
                }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="overflow-hidden rounded-3xl"
                style={
                  selected.isFull
                    ? { maxHeight: '85vh', maxWidth: '85vw', aspectRatio: '9/16', height: 'auto', width: 'auto' }
                    : { height: '100%', width: '100%' }
                }
              >
                <img
                  src={selected.src}
                  alt={selected.alt}
                  className="h-full w-full object-contain pointer-events-none"
                />
              </div>
            </motion.div>

            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:right-6 md:top-6 md:h-10 md:w-10"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4l10 10M14 4L4 14" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  );
}
