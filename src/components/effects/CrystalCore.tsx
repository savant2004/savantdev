import { useCanvas } from '../../hooks/useCanvas';

interface CrystalCoreProps {
  className?: string;
}

interface Voxel {
  // Normalised position on unit sphere
  x: number;
  y: number;
  z: number;
  hue: number;
}

/**
 * Procedural crystal core: a rotating field of glowing voxel pixels
 * distributed on a sphere (fibonacci lattice), rendered with a faux-3D
 * projection. This replaces a generic 3D "S" sculpture with something
 * far more original — a living crystal of light.
 *
 * Paired in the hero with 3 SVG orbit rings (rendered separately) and an
 * outer/inner glow. Canvas only — no three.js dependency.
 */
export function CrystalCore({ className }: CrystalCoreProps) {
  // Build a stable voxel cloud on a fibonacci sphere once.
  const voxels: Voxel[] = [];
  const N = 320;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2; // 1..-1
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    voxels.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      hue: 350 + (i / N) * 40, // crimson → ember → gold
    });
  }

  const draw = (ctx: CanvasRenderingContext2D, t: number) => {
    const w = ctx.canvas.clientWidth;
    const h = ctx.canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) * 0.36;

    // Rotation angles driven by time
    const ay = t * 0.00025; // y-axis spin
    const ax = Math.sin(t * 0.00015) * 0.35; // gentle tilt wobble

    const cosY = Math.cos(ay);
    const sinY = Math.sin(ay);
    const cosX = Math.cos(ax);
    const sinX = Math.sin(ax);

    // Project each voxel and sort by depth (painter's algorithm)
    const projected = voxels.map((v) => {
      // Rotate around Y
      let x = v.x * cosY + v.z * sinY;
      let z = -v.x * sinY + v.z * cosY;
      let y = v.y;
      // Rotate around X
      const y2 = y * cosX - z * sinX;
      z = y * sinX + z * cosX;
      y = y2;

      const persp = 1 / (1.8 - z * 0.6); // simple perspective
      return {
        sx: cx + x * scale * persp,
        sy: cy + y * scale * persp,
        depth: z,
        hue: v.hue,
        size: 1.4 * persp,
        alpha: 0.35 + (z + 1) * 0.32, // front voxels brighter
      };
    });
    projected.sort((a, b) => a.depth - b.depth);

    // Inner core glow (pulsing radial)
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.002);
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.9);
    coreGrad.addColorStop(0, `rgba(220, 20, 60, ${0.5 * pulse})`);
    coreGrad.addColorStop(0.5, `rgba(255, 107, 53, ${0.18 * pulse})`);
    coreGrad.addColorStop(1, 'rgba(255, 176, 0, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, scale * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Voxels (additive) — square pixels to match the pixel identity
    ctx.globalCompositeOperation = 'lighter';
    for (const p of projected) {
      const s = p.size * 1.6;
      const glow = s * 3;
      ctx.fillStyle = `hsla(${p.hue}, 95%, 60%, ${p.alpha * 0.25})`;
      ctx.fillRect(p.sx - glow / 2, p.sy - glow / 2, glow, glow);
      ctx.fillStyle = `hsla(${p.hue}, 95%, 85%, ${p.alpha})`;
      ctx.fillRect(p.sx - s / 2, p.sy - s / 2, s, s);
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  const canvasRef = useCanvas(draw, [], {
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
