import { useRef, useEffect } from 'react';

interface GalaxyBackgroundProps {
  className?: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  hue: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  layer: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  hue: number;
  alpha: number;
  driftX: number;
  driftY: number;
}

interface ShootingStar {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  tail: number;
}

export function GalaxyBackground({ className }: GalaxyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const stars: Star[] = [];
    const nebulae: Nebula[] = [];
    const shootingStar: ShootingStar = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, tail: 0 };

    function init(w: number, h: number) {
      stars.length = 0;
      nebulae.length = 0;

      const area = w * h;

      // Background stars (small, faint)
      const bgCount = Math.floor(area / 800);
      for (let i = 0; i < bgCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.3 + Math.random() * 0.8,
          baseAlpha: 0.04 + Math.random() * 0.12,
          hue: Math.random() < 0.3 ? 210 + Math.random() * 40 : 0,
          twinkleSpeed: 0.3 + Math.random() * 0.7,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer: 0,
        });
      }

      // Mid stars
      const midCount = Math.floor(area / 4000);
      for (let i = 0; i < midCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 0.6 + Math.random() * 1.5,
          baseAlpha: 0.08 + Math.random() * 0.2,
          hue: Math.random() < 0.4 ? 350 + Math.random() * 20 : Math.random() < 0.5 ? 10 + Math.random() * 15 : 0,
          twinkleSpeed: 0.5 + Math.random() * 1.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer: 1,
        });
      }

      // Bright stars (few, pronounced glow)
      const brightCount = Math.floor(area / 25000);
      for (let i = 0; i < brightCount; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: 1.5 + Math.random() * 3,
          baseAlpha: 0.15 + Math.random() * 0.35,
          hue: Math.random() < 0.5 ? 350 + Math.random() * 20 : 10 + Math.random() * 20,
          twinkleSpeed: 0.3 + Math.random() * 0.6,
          twinkleOffset: Math.random() * Math.PI * 2,
          layer: 2,
        });
      }

      // Nebula clouds
      const nebCount = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < nebCount; i++) {
        nebulae.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 150 + Math.random() * 350,
          hue: Math.random() < 0.5 ? 350 : 10,
          alpha: 0.015 + Math.random() * 0.025,
          driftX: (Math.random() - 0.5) * 0.15,
          driftY: (Math.random() - 0.5) * 0.15,
        });
      }
    }

    function spawnShootingStar(w: number, h: number) {
      shootingStar.active = true;
      const angle = -0.6 - Math.random() * 0.8;
      const speed = 4 + Math.random() * 6;
      shootingStar.x = Math.random() * w * 0.8 + w * 0.1;
      shootingStar.y = Math.random() * h * 0.3;
      shootingStar.vx = Math.cos(angle) * speed;
      shootingStar.vy = Math.sin(angle) * speed;
      shootingStar.life = 0;
      shootingStar.maxLife = 40 + Math.random() * 60;
      shootingStar.tail = 8 + Math.random() * 12;
    }

    function resize() {
      const { width, height } = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.floor(width * dpr));
      H = Math.max(1, Math.floor(height * dpr));
      canvas!.width = W;
      canvas!.height = H;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      init(width, height);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let lastTime = 0;
    let shootingStarTimer = 0;

    const loop = (time: number) => {
      raf = 0;
      const dt = lastTime ? Math.min((time - lastTime) / 16.67, 3) : 1;
      lastTime = time;
      const t = time * 0.001;

      const cw = canvas!.clientWidth;
      const ch = canvas!.clientHeight;

      ctx!.clearRect(0, 0, cw, ch);

      // --- Nebula clouds ---
      for (const n of nebulae) {
        n.x += n.driftX * dt;
        n.y += n.driftY * dt;
        if (n.x < -n.radius) n.x = cw + n.radius;
        if (n.x > cw + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = ch + n.radius;
        if (n.y > ch + n.radius) n.y = -n.radius;

        const grad = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        const pulseAlpha = n.alpha * (0.7 + 0.3 * Math.sin(t * 0.15 + n.hue));
        grad.addColorStop(0, `hsla(${n.hue}, 80%, 40%, ${pulseAlpha})`);
        grad.addColorStop(0.5, `hsla(${n.hue}, 70%, 25%, ${pulseAlpha * 0.5})`);
        grad.addColorStop(1, `hsla(${n.hue}, 60%, 15%, 0)`);
        ctx!.fillStyle = grad;
        ctx!.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
      }

      // --- Stars ---
      ctx!.globalCompositeOperation = 'lighter';

      for (const s of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.baseAlpha * twinkle;
        const size = s.size * (0.9 + 0.1 * twinkle);

        if (s.layer === 2) {
          // Bright stars — render with glow
          const glow = size * 5;
          const grad = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, glow);
          grad.addColorStop(0, `hsla(${s.hue || 350}, 90%, 70%, ${alpha * 0.3})`);
          grad.addColorStop(1, `hsla(${s.hue || 350}, 90%, 70%, 0)`);
          ctx!.fillStyle = grad;
          ctx!.fillRect(s.x - glow, s.y - glow, glow * 2, glow * 2);
        }

        const hue = s.hue || (s.layer < 2 ? 0 : 350);
        if (s.layer === 0) {
          ctx!.fillStyle = `hsla(0, 0%, 80%, ${alpha})`;
        } else if (s.layer === 1) {
          ctx!.fillStyle = `hsla(${hue}, 60%, 85%, ${alpha})`;
        } else {
          ctx!.fillStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;
        }
        ctx!.fillRect(s.x - size / 2, s.y - size / 2, size, size);
      }

      ctx!.globalCompositeOperation = 'source-over';

      // --- Shooting star ---
      shootingStarTimer += dt;
      if (!shootingStar.active && shootingStarTimer > 120 + Math.random() * 180) {
        spawnShootingStar(cw, ch);
        shootingStarTimer = 0;
      }

      if (shootingStar.active) {
        shootingStar.x += shootingStar.vx * dt;
        shootingStar.y += shootingStar.vy * dt;
        shootingStar.life += dt;

        const progress = shootingStar.life / shootingStar.maxLife;
        const fadeOut = Math.max(0, 1 - progress * progress);

        if (progress >= 1 || shootingStar.x < -50 || shootingStar.x > cw + 50 || shootingStar.y > ch + 50) {
          shootingStar.active = false;
        } else {
          ctx!.globalCompositeOperation = 'lighter';

          // Tail
          const tailLen = shootingStar.tail * (1 - progress * 0.5);
          for (let i = 0; i < tailLen; i++) {
            const p = i / tailLen;
            const tx = shootingStar.x - shootingStar.vx * p * 2;
            const ty = shootingStar.y - shootingStar.vy * p * 2;
            const ta = fadeOut * (1 - p) * 0.6;
            const ts = 1.5 - p;
            ctx!.fillStyle = `hsla(350, 100%, 70%, ${ta})`;
            ctx!.fillRect(tx - ts / 2, ty - ts / 2, ts, ts);
          }

          // Head glow
          const headGlow = 6;
          const grad = ctx!.createRadialGradient(shootingStar.x, shootingStar.y, 0, shootingStar.x, shootingStar.y, headGlow);
          grad.addColorStop(0, `hsla(350, 100%, 80%, ${fadeOut * 0.8})`);
          grad.addColorStop(1, `hsla(350, 100%, 80%, 0)`);
          ctx!.fillStyle = grad;
          ctx!.fillRect(shootingStar.x - headGlow, shootingStar.y - headGlow, headGlow * 2, headGlow * 2);

          ctx!.fillStyle = `hsla(0, 0%, 95%, ${fadeOut})`;
          ctx!.fillRect(shootingStar.x - 1, shootingStar.y - 1, 2, 2);

          ctx!.globalCompositeOperation = 'source-over';
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
    />
  );
}
