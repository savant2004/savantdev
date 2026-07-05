import { useCanvas } from '../../hooks/useCanvas';

interface ParticleFieldProps {
  className?: string;
  /** Particle count density factor. */
  density?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
  alpha: number;
}

/**
 * Ambient drifting particle field used behind the hero. Particles slowly
 * drift upward with subtle horizontal sway and a purple→pink glow.
 */
export function ParticleField({
  className,
  density = 0.00008,
}: ParticleFieldProps) {
  const draw = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;
    // (Re)seed particles when canvas resizes — store on ctx for persistence
    const state = ctx as unknown as { __particles?: Particle[] };
    const count = Math.max(40, Math.floor(width * height * density));
    if (!state.__particles || state.__particles.length !== count) {
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -0.1 - Math.random() * 0.3,
              r: 1.2 + Math.random() * 3.2,
          hue: Math.random() < 0.5 ? 350 + Math.random() * 15 : 10 + Math.random() * 25,
          alpha: 0.2 + Math.random() * 0.5,
        });
      }
      state.__particles = arr;
    }

    const particles = state.__particles!;
    ctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      // wrap
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      grad.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.alpha})`);
      grad.addColorStop(1, `hsla(${p.hue}, 90%, 70%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const canvasRef = useCanvas(draw);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    />
  );
}
