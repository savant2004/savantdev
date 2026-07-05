import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelLogo } from '../effects/PixelLogo';

interface LoadingScreenProps {
  onComplete: () => void;
}

// Terminal boot lines (Scene 6).
const BOOT_LINES = [
  '> initializing systems',
  '> loading ecosystem',
  '> loading projects',
  '> loading intelligence',
  '> welcome to savant',
];

/**
 * Phase 1 — Loading Experience (scrolltelling spec).
 *
 * A thin wrapper around `<PixelLogo mode="loading">` which drives the full
 * 6-scene pixel choreography (flicker → swarm → wave → assemble → ambient
 * alive → terminal boot). The logo REMAINS through the exit — the overlay
 * simply fades to reveal the hero beneath it.
 *
 * Shown once per tab session; skipped under prefers-reduced-motion.
 */
export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [bootIndex, setBootIndex] = useState(-1);
  const ambientRef = useRef<HTMLCanvasElement>(null);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lock body scroll while visible.
  useEffect(() => {
    if (visible && !reduced) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible, reduced]);

  // Preload critical fonts so they're ready when the loading screen fades.
  useEffect(() => {
    if (reduced) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href =
      'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Jersey+25&display=swap';
    document.head.appendChild(link);
    return () => link.remove();
  }, [reduced]);

  // Reduced motion: skip immediately.
  useEffect(() => {
    if (reduced) {
      setVisible(false);
      const id = window.setTimeout(onComplete, 50);
      return () => window.clearTimeout(id);
    }
  }, [reduced, onComplete]);

  // Ambient floating particles — drawn on a separate full-bleed canvas so
  // the wordmark canvas can be exactly the same size as the hero's.
  useEffect(() => {
    if (!visible || reduced) return;

    const canvas = ambientRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed ambient particles.
    const w = window.innerWidth;
    const h = window.innerHeight;
    const amb: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      alpha: number;
    }[] = [];
    const count = Math.min(260, Math.floor((w * h) / 6000));
    for (let i = 0; i < count; i++) {
      amb.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.05 - Math.random() * 0.18,
        size: 0.6 + Math.random() * 1.3,
        hue:
          Math.random() < 0.5
            ? 350 + Math.random() * 15
            : 10 + Math.random() * 25,
        alpha: 0.08 + Math.random() * 0.22,
      });
    }

    // Falling squares.
    const sqs: {
      x: number;
      y: number;
      size: number;
      speed: number;
      rotation: number;
      rotSpeed: number;
      hue: number;
      alpha: number;
    }[] = [];
    const sqCount = Math.min(30, Math.floor((w * h) / 50000));
    for (let i = 0; i < sqCount; i++) {
      sqs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 10,
        speed: 0.3 + Math.random() * 0.7,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        hue: Math.random() < 0.5 ? 350 + Math.random() * 15 : 10 + Math.random() * 25,
        alpha: 0.04 + Math.random() * 0.12,
      });
    }

    const t0 = performance.now();
    let raf = 0;

    const loop = (now: number) => {
      raf = 0;
      const t = now - t0;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);

      // Fade in after 1.5s (matches PixelLogo's ambientMix ramp).
      const mix = Math.min(1, Math.max(0, (t - 1500) / 600));
      if (mix > 0) {
        ctx.globalCompositeOperation = 'lighter';
        for (const a of amb) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.y < -5) {
            a.y = ch + 5;
            a.x = Math.random() * cw;
          }
          if (a.x < -5) a.x = cw + 5;
          if (a.x > cw + 5) a.x = -5;
          const flick = 0.6 + 0.4 * Math.sin(t * 0.002 + a.hue);
          const glow = a.size * 1.9;
          ctx.fillStyle = `hsla(${a.hue}, 100%, 46%, ${a.alpha * flick * mix * 0.2})`;
          ctx.fillRect(a.x - glow / 2, a.y - glow / 2, glow, glow);
          ctx.fillStyle = `hsla(${a.hue}, 95%, 80%, ${a.alpha * flick * mix})`;
          ctx.fillRect(
            a.x - a.size / 2,
            a.y - a.size / 2,
            a.size,
            a.size,
          );
        }

        // Falling squares.
        for (const sq of sqs) {
          sq.y += sq.speed;
          sq.rotation += sq.rotSpeed;
          if (sq.y > ch + 10) {
            sq.y = -10;
            sq.x = Math.random() * cw;
          }
          ctx.save();
          ctx.translate(sq.x, sq.y);
          ctx.rotate(sq.rotation);
          ctx.strokeStyle = `hsla(${sq.hue}, 100%, 50%, ${sq.alpha * mix})`;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
          ctx.restore();
        }

        ctx.globalCompositeOperation = 'source-over';
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [visible, reduced]);

  const handlePixelComplete = () => {
    // Wait for fonts to be ready so the hero text renders correctly on reveal.
    document.fonts.ready.then(() => {
      setVisible(false);
      window.setTimeout(onComplete, 700);
    });
  };

  return (
    <AnimatePresence>
      {visible && !reduced && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
        >
          {/* Ambient particles — full-bleed background layer. */}
          <canvas
            ref={ambientRef}
            className="absolute inset-0 h-full w-full"
          />

          {/* Wordmark — full-bleed: canvas spans the whole screen so the
              pixel swarm isn't boxed in. The wordmark itself stays centered
              (text is drawn at width/2, height/2 by the sampler). */}
          <PixelLogo
            mode="loading"
            text="SAVANT"
            fontSize={200}
            step={7}
            className="absolute inset-0 h-full w-full"
            onComplete={handlePixelComplete}
            onBootLine={setBootIndex}
          />

          {/* Terminal boot lines (Scene 6) — fade in at the bottom. */}
          <div className="pointer-events-none absolute bottom-[16%] left-1/2 -translate-x-1/2 font-mono text-xs sm:text-sm">
            {BOOT_LINES.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 6 }}
                animate={
                  i <= bootIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
                }
                transition={{ duration: 0.5 }}
                 className={
                   i === BOOT_LINES.length - 1 ? 'text-crimson-500' : 'text-primary'
                 }
               >
                 {line}
                 {i === bootIndex && i !== BOOT_LINES.length - 1 && (
                   <span className="ml-0.5 inline-block w-2 animate-pulse text-crimson-500">
                    ▋
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
