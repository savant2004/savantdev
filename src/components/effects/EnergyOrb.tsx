import { useCanvas } from '../../hooks/useCanvas';

interface EnergyOrbProps {
  className?: string;
  /** Render as a soft vortex (CTA) vs a denser sphere (orbit). */
  variant?: 'sphere' | 'vortex';
}

/**
 * Animated glowing energy sphere/vortex rendered on canvas.
 * - `sphere`: dense pulsing core with swirling noise — used behind the orbit.
 * - `vortex`: large soft radial with rotating spiral arms — used in the CTA.
 */
export function EnergyOrb({ className, variant = 'sphere' }: EnergyOrbProps) {
  const draw = (ctx: CanvasRenderingContext2D, t: number) => {
    const w = ctx.canvas.clientWidth;
    const h = ctx.canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(w, h) / 2;

    ctx.globalCompositeOperation = 'lighter';

    if (variant === 'vortex') {
      // Spiral arms
      const arms = 5;
      const turns = 3;
      const samples = 220;
      for (let a = 0; a < arms; a++) {
        const armOffset = (a / arms) * Math.PI * 2;
        for (let s = 0; s < samples; s++) {
          const f = s / samples;
          const angle = armOffset + f * Math.PI * 2 * turns + t * 0.0004;
          const r = f * maxR * 0.95;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
              const hue = 350 + f * 40;
          const alpha = (1 - f) * 0.5;
          const sz = (1 - f) * 3 + 0.5;
          const g = ctx.createRadialGradient(x, y, 0, x, y, sz * 3);
          g.addColorStop(0, `hsla(${hue}, 95%, 70%, ${alpha})`);
          g.addColorStop(1, `hsla(${hue}, 95%, 70%, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, sz * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Sphere: layered rotating arcs + core
      const layers = 4;
      for (let l = 0; l < layers; l++) {
        const r = maxR * (0.4 + l * 0.18);
        const segs = 60;
        ctx.beginPath();
        for (let s = 0; s <= segs; s++) {
          const f = s / segs;
          const angle = f * Math.PI * 2 + t * 0.0003 * (l % 2 ? 1 : -1);
          const wobble = Math.sin(angle * 3 + t * 0.001 + l) * 4;
          const x = cx + Math.cos(angle) * (r + wobble);
          const y = cy + Math.sin(angle) * (r + wobble);
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
          const hue = 350 + l * 10;
        ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${0.25 - l * 0.04})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Central pulsing core (both variants)
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.0025);
    const coreR = maxR * (variant === 'vortex' ? 0.22 : 0.3);
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * pulse * 2);
    core.addColorStop(0, `rgba(255, 255, 255, ${0.85 * pulse})`);
    core.addColorStop(0.2, `rgba(220, 20, 60, ${0.6 * pulse})`);
    core.addColorStop(0.6, `rgba(255, 107, 53, ${0.25 * pulse})`);
    core.addColorStop(1, 'rgba(255, 176, 0, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * pulse * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
  };

  const canvasRef = useCanvas(draw, [variant], {
    clear: true,
    pauseOffscreen: true,
  });

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
      aria-hidden
    />
  );
}
