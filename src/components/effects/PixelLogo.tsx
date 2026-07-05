import { useEffect, useRef, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

import { clamp } from '../../lib/utils';
import { sampleTextPixels } from '../../lib/pixelText';

type Mode = 'idle' | 'loading';

interface PixelLogoProps {
  text?: string;
  /** 'idle' = hero (assemble + mouse interaction); 'loading' = 6-scene intro. */
  mode?: Mode;
  className?: string;
  /** Pixel sample step in px (smaller = denser). */
  step?: number;
  /** Font size in px. Jersey 25. */
  fontSize?: number;
  /** Text alignment: 'center' (default) or 'left'. */
  align?: 'center' | 'left';
  /** Loading mode only: fired when the full intro choreography completes. */
  onComplete?: () => void;
  /** Loading mode only: reports the current boot line index (0-based). */
  onBootLine?: (index: number) => void;
}

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  baseAlpha: number;
  phase: number;
  seed: number;
  lane: number;
}

interface BackgroundPixel {
  x: number;
  y: number;
  size: number;
  hue: number;
  alpha: number;
  baseAlpha: number;
  depth: number;
}

// Loading timeline (ms). Total intro ~2.9s before exit.
const TL = {
  flickerEnd: 450,
  swarmEnd: 950,
  waveEnd: 1450,
  assembleEnd: 2050,
  bootStart: 2050,
  exitStart: 2900,
};

/**
 * The single source of truth for the SAVANT pixel wordmark.
 *
 * - `mode="idle"` (hero): pixels assemble once, then breathe + repel the
 *   cursor. Click scatters them (easter egg).
 * - `mode="loading"` (intro): the 6-scene scrolltelling choreography —
 *   flicker → swarm → horizontal wave → assemble → breathing. Calls
 *   `onComplete` once the sequence finishes so the wrapper can unmount and
 *   reveal the hero.
 *
 * Both modes render square glowing pixels in Jersey 25 into the same
 * canvas size. The parent container controls width; height matches the
 * wordmark. This ensures loading → hero is pixel-identical.
 */
export function PixelLogo({
  text = 'SAVANT',
  mode = 'idle',
  className,
  step = 6,
  fontSize = 96,
  align,
  onComplete,
  onBootLine,
}: PixelLogoProps) {
  const reduced = usePrefersReducedMotion();
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const scatterRef = useRef(0);
  const startedRef = useRef(false);
  const [winWidth, setWinWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  const particlesRef = useRef<Particle[]>([]);
  const backgroundRef = useRef<BackgroundPixel[]>([]);
  const resolvedFont = `${fontSize}px "Jersey 25", monospace`;

  // Sample targets from the text. Both modes use the same sampling box.
  useEffect(() => {
    let cancelled = false;

    const measure = () => {
      const full = mode === 'loading';
      // Use the canvas's actual parent element width for accurate sizing
      const parentW = canvasRef.current?.parentElement?.clientWidth ?? window.innerWidth;
      const cw = full ? window.innerWidth : Math.min(700, parentW);
      // Scale font size down on narrow viewports
      const effectiveFs = full ? fontSize : Math.min(fontSize, cw * 0.55);
      const ch = full ? window.innerHeight : effectiveFs * 1.0;
      const sampled = sampleTextPixels(text, {
        step,
        width: cw,
        height: Math.ceil(ch),
        font: resolvedFont,
        align,
      });
      particlesRef.current = sampled.map((s, i) => ({
        tx: s.x,
        ty: s.y,
        hue: s.hue,
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: step * 0.68,
        baseAlpha: 0.82 + Math.random() * 0.18,
        phase: Math.random() * Math.PI * 2,
        seed: Math.random() * Math.PI * 2,
        lane: i % 5,

      }));

      // Seed dense background pixel field behind text (idle only)
      if (mode === 'idle') {
        const bg: BackgroundPixel[] = [];
        const count = 140;
        const pixelSize = step * 1.5;

        // Compute text pixel bounding box with fallback
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        if (sampled.length > 0) {
          for (const p of sampled) {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
          }
        } else {
          minX = cw * 0.15; maxX = cw * 0.85;
          minY = ch * 0.15; maxY = ch * 0.85;
        }
        const bw = (maxX - minX) * 1.4;
        const bh = (maxY - minY) * 1.4;
        const bCX = (minX + maxX) / 2;
        const bCY = (minY + maxY) / 2;

        let placed = 0;
        let attempts = 0;
        const maxAttempts = count * 50;
        while (placed < count && attempts < maxAttempts) {
          attempts++;
          const x = bCX + (Math.random() - 0.5) * bw;
          const y = bCY + (Math.random() - 0.5) * bh;
          // Reject if too close to any text pixel
          let overlap = false;
          for (const sp of sampled) {
            const ddx = x - sp.x;
            const ddy = y - sp.y;
            if (ddx * ddx + ddy * ddy < step * step) {
              overlap = true;
              break;
            }
          }
          if (overlap) continue;
          const depth = Math.floor(Math.random() * 3);
          const depthAlpha = [0.7, 0.4, 0.18][depth];
          bg.push({
            x,
            y,
            size: pixelSize,
            hue: 355 + Math.random() * 25,
            alpha: depthAlpha * (0.7 + Math.random() * 0.3),
            baseAlpha: depthAlpha * (0.7 + Math.random() * 0.3),
            depth,
          });
          placed++;
        }
        backgroundRef.current = bg;
      }
    };

    const run = async () => {
      measure();
      try {
        await (document as Document).fonts.load(resolvedFont, text);
        await (document as Document).fonts.ready;
      } catch {
        /* fonts API unavailable — keep the initial sample */
      }
      if (!cancelled) measure();
    };
    void run();

    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, step, mode, align]);

  // Track window width for responsive canvas height
  useEffect(() => {
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keep the latest callbacks in refs so the timeline effect below can run
  // exactly once (its timers must never be torn down by a re-render).
  const onCompleteRef = useRef(onComplete);
  const onBootLineRef = useRef(onBootLine);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onBootLineRef.current = onBootLine;
  });

  // Loading-mode timeline (terminal boot + exit). Runs once.
  useEffect(() => {
    if (mode !== 'loading' || reduced || startedRef.current) return;
    startedRef.current = true;

    const BOOT = [
      '> initializing systems',
      '> loading ecosystem',
      '> loading projects',
      '> loading intelligence',
      '> welcome to savant',
    ];
    const timers: number[] = [];
    BOOT.forEach((_, i) => {
      timers.push(
        window.setTimeout(
          () => onBootLineRef.current?.(i),
          TL.bootStart + 150 + i * 150,
        ),
      );
    });
    timers.push(
      window.setTimeout(() => onCompleteRef.current?.(), TL.exitStart),
    );
    // Reset the run-once guard on cleanup so a StrictMode (dev) remount
    // re-schedules the timeline. StrictMode mounts → unmounts (clearing the
    // timers above) → remounts; refs survive the cycle, so without this
    // reset the second mount would bail out early and `onComplete` would
    // never fire, leaving the LoadingScreen stuck forever.
    return () => {
      startedRef.current = false;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [mode, reduced]);

  const draw = (ctx: CanvasRenderingContext2D, t: number) => {
    const particles = particlesRef.current;
    if (!particles.length) return;
    const w = ctx.canvas.clientWidth;

    ctx.globalCompositeOperation = 'lighter';

    const mouse = mouseRef.current;
    const scatter = scatterRef.current;

    // Draw dense background pixel field behind text (idle only)
    if (mode === 'idle') {
      const bg = backgroundRef.current;

      for (const p of bg) {
        paintSolidSquare(ctx, p.x, p.y, p.size, p.hue, p.baseAlpha);
      }
    }

    for (const p of particles) {
      if (mode === 'idle') {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist2 = dx * dx + dy * dy;
        const repel = 70;
        if (mouse.active && dist2 < repel * repel) {
          const dist = Math.sqrt(dist2) || 1;
          const force = (1 - dist / repel) * 6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        if (scatter > 0) {
          p.vx += (Math.random() - 0.5) * scatter;
          p.vy += (Math.random() - 0.5) * scatter;
        }
        p.vx += (p.tx - p.x) * 0.12;
        p.vy += (p.ty - p.y) * 0.12;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
        const breathe = reduced
          ? p.baseAlpha
          : p.baseAlpha * (0.85 + 0.15 * Math.sin(t * 0.002 + p.phase));
        paintLED(ctx, p.x, p.y, p.size, p.hue, breathe);
      } else {
        // --- Loading 6-scene choreography, branched on elapsed t ---
        let alpha = p.baseAlpha;
        if (t < TL.flickerEnd) {
          // Scene 1: scattered flicker, ~12–62% of pixels visible
          const reveal = t / TL.flickerEnd;
          if (p.seed % (Math.PI * 2) > 1.4 - reveal * 0.8) continue;
          p.x += (Math.random() - 0.5) * 0.3;
          p.y += (Math.random() - 0.5) * 0.3;
          const flick = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.004 + p.seed));
          alpha *= flick * 0.6;
        } else if (t < TL.swarmEnd) {
          // Scene 2: swarm forms — gentle pull + vertical sine
          const ph = (t - TL.flickerEnd) / (TL.swarmEnd - TL.flickerEnd);
          p.vx += (p.tx - p.x) * 0.0012 * ph;
          p.vy += Math.sin(t * 0.0025 + p.seed) * 0.06;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.x += p.vx;
          p.y += p.vy;
          alpha *= 0.7;
        } else if (t < TL.waveEnd) {
          // Scene 3: horizontal wave in lanes following invisible paths
          p.vx += 0.15;
          p.vy = Math.sin(t * 0.003 + p.lane + p.x * 0.01) * 0.8;
          p.vx *= 0.9;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x > w + 10) p.x = -10;
          alpha *= 0.75;
        } else if (t < TL.assembleEnd) {
          // Scene 4: wave bends — tighten spring into target positions
          const ph = (t - TL.waveEnd) / (TL.assembleEnd - TL.waveEnd);
          const k = 0.04 + ph * 0.1;
          p.vx += (p.tx - p.x) * k;
          p.vy += (p.ty - p.y) * k;
          p.vx *= 0.78;
          p.vy *= 0.78;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          // Scene 5/6: locked, breathing. Identical to idle so the loading →
          // hero handoff is pixel-perfect.
          p.vx += (p.tx - p.x) * 0.12;
          p.vy += (p.ty - p.y) * 0.12;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
          const breathe = reduced
            ? p.baseAlpha
            : p.baseAlpha * (0.8 + 0.2 * Math.sin(t * 0.002 + p.phase));
          alpha *= breathe / p.baseAlpha;
        }
        paintLED(ctx, p.x, p.y, p.size, p.hue, alpha);
      }
    }

    ctx.globalCompositeOperation = 'source-over';

    if (scatter > 0) {
      scatterRef.current = clamp(scatter - 0.05, 0, 10);
    }
  };

  const canvasRef = useCanvas(draw, [text, step, mode, winWidth], {
    clear: true,
    pauseOffscreen: mode === 'idle',
  });

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };
  const handleLeave = () => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  };
  const handleClick = () => {
    scatterRef.current = 8;
  };

  const full = mode === 'loading';
  const cwForH = Math.min(700, winWidth);
  const effectiveFs = full ? fontSize : Math.min(fontSize, cwForH * 0.55);
  const canvasHeight = full ? '100%' : Math.ceil(effectiveFs * 1.0);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: canvasHeight, display: 'block' }}
      onPointerMove={mode === 'idle' ? handleMove : undefined}
      onPointerLeave={mode === 'idle' ? handleLeave : undefined}
      onClick={mode === 'idle' ? handleClick : undefined}
      role="img"
      aria-label={`${text} logo built from glowing pixels`}
    />
  );
}

/** Multi-layer LED pixel with volumetric bloom glow. */
function paintLED(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  hue: number,
  alpha: number,
) {
  const s = size * 0.5;
  // Layer 1: Wide ambient glow
  const g1 = size * 4.5;
  ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha * 0.06})`;
  ctx.fillRect(x - g1 / 2, y - g1 / 2, g1, g1);
  // Layer 2: Medium bloom
  const g2 = size * 2.8;
  ctx.fillStyle = `hsla(${hue}, 100%, 55%, ${alpha * 0.14})`;
  ctx.fillRect(x - g2 / 2, y - g2 / 2, g2, g2);
  // Layer 3: Tight glow
  const g3 = size * 1.5;
  ctx.fillStyle = `hsla(${hue}, 100%, 62%, ${alpha * 0.35})`;
  ctx.fillRect(x - g3 / 2, y - g3 / 2, g3, g3);
  // Layer 4: Inner glow
  const g4 = size * 0.9;
  ctx.fillStyle = `hsla(${hue}, 90%, 75%, ${alpha * 0.65})`;
  ctx.fillRect(x - g4 / 2, y - g4 / 2, g4, g4);
  // Layer 5: Hot core
  ctx.fillStyle = `hsla(${hue}, 60%, 94%, ${alpha * 0.85})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
}

/** Crisp solid square (no bloom) for background field pixels. */
function paintSolidSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  hue: number,
  alpha: number,
) {
  const g = size * 1.4;
  ctx.fillStyle = `hsla(${hue}, 90%, 55%, ${alpha * 0.12})`;
  ctx.fillRect(x - g / 2, y - g / 2, g, g);
  ctx.fillStyle = `hsla(${hue}, 80%, 75%, ${alpha * 0.7})`;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
}
