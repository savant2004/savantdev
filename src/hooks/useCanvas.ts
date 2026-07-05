import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

type DrawFn = (ctx: CanvasRenderingContext2D, t: number) => void;

interface CanvasOptions {
  /** Whether to clear each frame. Default true. */
  clear?: boolean;
  /** Pause the loop when offscreen. Default true. */
  pauseOffscreen?: boolean;
}

/**
 * Sets up a high-DPI canvas and a single rAF loop, calling `draw` each frame
 * with the elapsed time in ms. Pauses automatically when the canvas scrolls
 * offscreen and when the user prefers reduced motion (draws one static frame).
 */
export function useCanvas(
  draw: DrawFn,
  deps: React.DependencyList = [],
  { clear = true, pauseOffscreen = true }: CanvasOptions = {},
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
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

    const render = (t: number) => {
      if (clear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      drawRef.current(ctx, t);
    };

    // Static frame for reduced motion / offscreen
    if (reduced) {
      render(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let visible = !pauseOffscreen;
    let lastT = performance.now();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          lastT = performance.now();
          raf = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.01 },
    );
    if (pauseOffscreen) io.observe(canvas);

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      const t = now - lastT;
      render(t);
      raf = requestAnimationFrame(loop);
    };
    if (visible) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return canvasRef;
}
