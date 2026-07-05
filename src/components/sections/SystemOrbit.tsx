import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionEyebrow } from '../foundation/SectionShell';
import { orbitNodes } from '../../data/orbitNodes';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function OrbitIcon({ iconKey }: { iconKey: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10">
      {iconKey === 'target' && <><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></>}
      {iconKey === 'nodes' && <><path d="M12 3L3 8l9 5 9-5-9-5z" /><path d="M3 16l9 5 9-5" /><path d="M3 12l9 5 9-5" /></>}
      {iconKey === 'code' && <><path d="M8 7L3 12l5 5M16 7l5 5-5 5" /></>}
      {iconKey === 'rocket' && <><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" /></>}
      {iconKey === 'chart' && <><path d="M3 17l4-4 4 4 8-8" /><path d="M17 9h4v4" /></>}
      {iconKey === 'star' && <><path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16l-6.4 4.8L8 14l-6-4.8h7.6L12 2z" /></>}
    </svg>
  );
}

const PATH_D = `
M 400 20

C 520 120 540 220 400 300

C 250 400 80 520 150 600

C 260 720 760 760 650 900

C 520 1040 40 1080 150 1200

C 280 1340 760 1380 650 1500

C 520 1660 350 1720 400 1800

C 440 1880 420 1960 400 2050
`;

const FLYING_SHAPES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
type: [
  'square',
  'diamond',
  'star',
  'hexagon',
  'cross',
  'circle',
  'triangle',
  'pixel'
][i % 8],

x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 12,
  speed: 0.2 + Math.random() * 0.6,
  driftX: (Math.random() - 0.5) * 40,
  driftY: (Math.random() - 0.5) * 40,
  delay: Math.random() * 4,
  layer: Math.floor(Math.random() * 3),
}));

const nodeProgressMap = [
  0.14, // 01
  0.28, // 02
  0.38, // 03
  0.52, // 04
  0.67, // 05
  0.78, // 06
];

function getNodeState(
  nodeIdx: number,
  progress: number
) {
  const trigger = nodeProgressMap[nodeIdx];

  const dist = progress - trigger;

  if (dist > 0.04) return 'completed';
  if (dist > -0.015) return 'active';
  if (dist > -0.09) return 'approaching';

  return 'inactive';
}



function ShapeSvg({ type, size }: { type: string; size: number }) {
  const s = size;
  const mid = s / 2;
  const inner = () => {
    switch (type) {
      case 'square':
        return <rect x={0} y={0} width={s} height={s} rx={1} fill="none" stroke="currentColor" strokeWidth={0.5} />;
      case 'diamond':
        return <polygon points={`${mid},0 ${s},${mid} ${mid},${s} 0,${mid}`} fill="none" stroke="currentColor" strokeWidth={0.5} />;
      case 'hexagon':
        return <polygon points={`${mid},0 ${s},${mid * 0.25} ${s},${mid * 0.75} ${mid},${s} 0,${mid * 0.75} 0,${mid * 0.25}`} fill="none" stroke="currentColor" strokeWidth={0.5} />;
      case 'cross':
        return <><line x1={mid * 0.3} y1={0} x2={mid * 0.3} y2={s} stroke="currentColor" strokeWidth={0.5} /><line x1={0} y1={mid * 0.3} x2={s} y2={mid * 0.3} stroke="currentColor" strokeWidth={0.5} /><line x1={s - mid * 0.3} y1={0} x2={s - mid * 0.3} y2={s} stroke="currentColor" strokeWidth={0.5} /><line x1={0} y1={s - mid * 0.3} x2={s} y2={s - mid * 0.3} stroke="currentColor" strokeWidth={0.5} /></>;
      case 'circle':
        return <circle cx={mid} cy={mid} r={mid * 0.6} fill="none" stroke="currentColor" strokeWidth={0.5} />;
      case 'triangle':
        return <polygon points={`${mid},0 ${s},${s} 0,${s}`} fill="none" stroke="currentColor" strokeWidth={0.5} />;
      case 'star':
        return (
          <polygon
            points="12,0 15,8 24,8 18,13 21,24 12,18 3,24 6,13 0,8 9,8"
            fill="none"
            stroke="currentColor"
            strokeWidth={0.5}
          />
        );
      case 'pixel':
        return (
          <>
            <rect x="0" y="0" width="6" height="6" />
            <rect x="8" y="8" width="6" height="6" />
            <rect x="16" y="0" width="6" height="6" />
          </>
        );
      default:
        return null;
    }
  };
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke="currentColor">
      {inner()}
    </svg>
  );
}

function CardContent({ node, isRight }: { node: typeof orbitNodes[number]; isRight: boolean }) {
  return (
    <div
      className="glass group relative overflow-hidden rounded-2xl border border-white/5 p-5 backdrop-blur-xl"
      style={{
        marginLeft: isRight ? '2rem' : 'auto',
        marginRight: isRight ? 'auto' : '2rem',
        maxWidth: 260,
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-500/10 text-crimson-500">
          <OrbitIcon iconKey={node.iconKey} />
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-widest text-crimson-500/60">
            {String(node.id).padStart(2, '0')}
          </div>
          <h3 className="font-body text-sm font-semibold text-text">
            {node.label}
          </h3>
        </div>
      </div>
      <p className="mb-3 font-body text-xs leading-relaxed text-muted">
        {node.desc}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {node.metrics.map((m) => (
          <span
            key={m}
            className="rounded-full border border-crimson-500/20 bg-crimson-500/5 px-2 py-0.5 font-mono text-[10px] text-crimson-500/80"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function CubeCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const half = 30 * progress;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      if (progress < 0.5) { frame = requestAnimationFrame(draw); return; }

      const p = (progress - 0.5) * 2;
      const rot = Date.now() * 0.001 * 0.4;

      const corners = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      ].map(([x, y, z]) => {
        const s = Math.sin(rot), c = Math.cos(rot);
        const rx = x * c - z * s;
        const rz = x * s + z * c;
        const scale = 200 / (200 + rz);
        return { x: cx + rx * half * scale, y: cy + y * half * scale };
      });

      ctx.strokeStyle = `rgba(220, 20, 60, ${0.3 + 0.7 * p})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#DC143C';
      ctx.shadowBlur = 15 * p;

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(corners[a].x, corners[a].y);
        ctx.lineTo(corners[b].x, corners[b].y);
        ctx.stroke();
      });

      if (getNodeState(6, p) === 'completed' || p > 0.6) {
        ctx.font = 'bold 14px Archivo Black';
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 20;
        ctx.textAlign = 'center';
        ctx.fillText('SAVANT', cx, cy + 5);
      }

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={160}
      className="relative z-10"
    />
  );
}

export function SystemOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const trainRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shapesRef = useRef<(HTMLDivElement | null)[]>([]);
  const sqCanvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const activeRef = useRef(-1);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [pulseIdx, setPulseIdx] = useState(-1);
  const [showFinal, setShowFinal] = useState(false);

  const setNodeRef = useCallback((i: number) => (el: HTMLDivElement | null) => { nodeRefs.current[i] = el; }, []);
  const setCardRef = useCallback((i: number) => (el: HTMLDivElement | null) => { cardRefs.current[i] = el; }, []);
  const setShapeRef = useCallback((i: number) => (el: HTMLDivElement | null) => { shapesRef.current[i] = el; }, []);

  useGSAP(() => {
    const svgWrap = svgWrapRef.current;
    const path = pathRef.current;
    if (!svgWrap || !path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    if (glowRef.current) {
      gsap.set(glowRef.current, { strokeDasharray: length, strokeDashoffset: length });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgWrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      duration: 1,
    }, 0);

    if (glowRef.current) {
      tl.to(glowRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        duration: 1,
      }, 0);
    }

    tl.to({}, {
      duration: 1.2,
      onUpdate: function () {
        const p = this.progress();
        progressRef.current = p;


        const newActive = orbitNodes.reduce((acc, _, i) => {
          const state = getNodeState(i, p);
          if (state === 'active' || state === 'completed') return i;
          return acc;
        }, -1);

        if (newActive !== activeRef.current) {
          gsap.fromTo(
  nodeRefs.current[newActive],
  {
    scale: 1,
  },
  {
    scale: 1.35,
    duration: 0.4,
    yoyo: true,
    repeat: 1,
  }
);
          activeRef.current = newActive;
          setActiveIdx(newActive);
          setPulseIdx(newActive);
          setTimeout(() => setPulseIdx(-1), 1200);
        }

        if (getNodeState(6, p) === 'completed' || p > 0.6) {
          setShowFinal(true);
        } else {
          setShowFinal(false);
        }

        // Update node element states via GSAP
orbitNodes.forEach((_, i) => {
  const el = nodeRefs.current[i];
  if (!el) return;

  const trigger = nodeProgressMap[i];

  const glow = Math.max(
    0,
    1 - Math.abs(p - trigger) * 12
  );

  gsap.to(el, {
    opacity: 0.15 + glow,
    scale: 0.85 + glow * 0.5,
    filter: `drop-shadow(
      0 0 ${glow * 40}px rgba(220,20,60,1)
    )`,
    duration: 0.15,
    overwrite: true,
  });
});

        // Animate floating shapes
        shapesRef.current.forEach((shapeEl, i) => {
          if (!shapeEl) return;
          const shape = FLYING_SHAPES[i];
          if (!shape) return;
          const offsetX = Math.sin(p * Math.PI * 2 * shape.speed + shape.delay) * shape.driftX * 0.3;
          const offsetY = Math.cos(p * Math.PI * 2 * shape.speed * 0.7 + shape.delay) * shape.driftY * 0.3;
          gsap.set(shapeEl, { x: offsetX, y: offsetY, opacity: 0.1 + 0.4 * Math.sin(p * Math.PI * 2 * 0.3 + shape.delay) });
        });

        // Train position along path
        const train = trainRef.current;
        if (train) {
          const drawLen = length * p *1.2;
          const trainCount = 5;
          for (let t = 0; t < trainCount; t++) {
const tLen = Math.max(
  0,
  drawLen - t * 30
);            if (tLen > 0) {
              const pt = path.getPointAtLength(tLen);
              const trainEl = train.children[t] as SVGCircleElement;
              if (trainEl) {
                gsap.set(trainEl, { attr: { cx: pt.x, cy: pt.y }, opacity: 1 - t * 0.15 });
              }
            }
          }
        }
      },
    }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, { scope: sectionRef });

  // Falling squares background.
  useEffect(() => {
    const canvas = sqCanvasRef.current;
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

    const w = window.innerWidth;
    const h = window.innerHeight;
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
    const count = Math.min(40, Math.floor((w * h) / 35000));
    for (let i = 0; i < count; i++) {
      sqs.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 2 + Math.random() * 8,
        speed: 0.2 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        hue: Math.random() < 0.5 ? 350 + Math.random() * 15 : 10 + Math.random() * 25,
        alpha: 0.03 + Math.random() * 0.1,
      });
    }

    let raf = 0;
    const loop = () => {
      raf = 0;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);

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
        ctx.strokeStyle = `hsla(${sq.hue}, 100%, 50%, ${sq.alpha})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-sq.size / 2, -sq.size / 2, sq.size, sq.size);
        ctx.restore();
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
    <section ref={sectionRef} className="relative bg-void">
      {/* Intro header — fills first viewport */}
      <div className="flex h-screen w-full items-center justify-center ">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionEyebrow className="text-sm sm:text-base">The System Path</SectionEyebrow>
          </div>
          <p className="mx-auto mt-6 max-w-2xl px-4 font-body text-2xl sm:text-3xl text-muted">
            One Orbit, <span className="text-gradient">six disciplines.</span>
          </p>
          <p className="mx-auto mt-4 max-w-2xl px-4 font-body text-base sm:text-lg text-muted/60">
            Every product passes through the same orbit — strategy to analytics, architecture to experience.
          </p>
        </div>
      </div>



      {/* Falling squares background */}
      <canvas
        ref={sqCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      />

      {/* Grid overlay */}
      <svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.03]" aria-hidden>
        <defs>
          <pattern id="orbit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DC143C" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#orbit-grid)" />
      </svg>

      {/* Main scroll area */}
      <div className="relative z-10 flex flex-col items-center py-8">
        {/* Floating shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {FLYING_SHAPES.map((shape, i) => (
            <div
              key={shape.id}
              ref={setShapeRef(i)}
              className="absolute text-crimson-500/30"
              style={{
                left: `${shape.x}%`,
                top: `${shape.y}%`,
                width: shape.size,
                height: shape.size,
                transform: `translate(-50%, -50%)`,
              }}
            >
              <ShapeSvg type={shape.type} size={shape.size} />
            </div>
          ))}
        </div>

        {/* SVG container — centered, max-width constrained */}
        <div ref={svgWrapRef} className="relative mx-auto hidden w-full max-w-[clamp(400px,75vw,1400px)] lg:block">
          {/* SVG Orbit */}
          <svg
            viewBox="0 0 800 2100"
            className="w-full h-auto"
            aria-hidden
          >
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#DC143C" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#E5383B" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glowFilter">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DC143C" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#DC143C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#DC143C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background glow path */}
            <path
              ref={glowRef}
              d={PATH_D}
              fill="none"
              stroke="#DC143C"
              strokeWidth={18}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.08}
              filter="url(#glowFilter)"
            />

            {/* Main path */}
            <path
              ref={pathRef}
              d={PATH_D}
              fill="none"
              stroke="url(#pathGrad)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glow highlight path */}
            <path
              d={PATH_D}
              fill="none"
              stroke="#FF6B35"
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.15}
              filter="url(#softGlow)"
              className="path-highlight"
            />

            {/* Train elements */}
            <g ref={trainRef}>
              {Array.from({ length: 12 }, (_, i) => (
                <circle key={i}r={6}
filter="url(#glowFilter)" fill="#DC143C" opacity={0} />
              ))}
            </g>

            {/* Static SVG node markers */}
            {orbitNodes.map((node) => (
              <g key={node.id} opacity={0.12}>
                <circle cx={node.x} cy={node.y} r={38} fill="none" stroke="currentColor" strokeWidth={0.5} className="text-crimson-500" />
                <text
                  x={node.x}
                  y={node.y + 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="currentColor"
                  className="font-mono text-crimson-500"
                  fontSize="22"
                  fontWeight="700"
                >
                  {String(node.id).padStart(2, '0')}
                </text>
              </g>
            ))}
          </svg>

          {/* HTML number nodes — overlaid on SVG */}
          <div className="pointer-events-none absolute inset-0">
            {orbitNodes.map((node, i) => (
              <div
                key={node.id}
                ref={setNodeRef(i)}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${(node.x / 800) * 100}%`,
                  top: `${(node.y / 2100) * 100}%`,
                  width: 'clamp(44px,6vw,76px)',
                  height: 'clamp(44px,6vw,76px)',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-crimson-500/20 blur-xl" />
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-crimson-500/40 blur-md" />
                  <div className="relative z-10 font-mono text-[clamp(16px,1.3vw,28px)] font-black text-crimson-500">
                    {String(node.id).padStart(2, '0')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Node ring expansion pulse */}
          <AnimatePresence>
            {pulseIdx >= 0 && (
              <motion.div
                key={`pulse-${pulseIdx}`}
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="pointer-events-none absolute rounded-full border border-crimson-500/60"
                style={{
                  width: 30,
                  height: 30,
                  left: `${(orbitNodes[pulseIdx].x / 800) * 100}%`,
                  top: `${(orbitNodes[pulseIdx].y / 2100) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* Content cards — positioned relative to SVG */}
          {orbitNodes.map((node, i) => {
            const isRight = node.side === 'right';
            return (
              <AnimatePresence key={node.id}>
{activeIdx >= i && (
                    <motion.div
                    ref={setCardRef(i)}
                    initial={{ opacity: 0, x: isRight ? 40 : -40, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: isRight ? 40 : -40 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                    className="pointer-events-auto absolute hidden px-6 lg:block"
           style={{
  top: `${(node.y / 2100) * 100}%`,
  left:
    node.side === 'right'
      ? 'calc(50% + 220px)'
      : 'calc(50% - 520px)',
  transform: 'translateY(-50%)',
 }}
                  >
                    <CardContent node={node} isRight={isRight} />
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}

          {/* Final convergence — overlaid at node 6 position */}
          <AnimatePresence>
            {showFinal && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute flex flex-col items-center justify-center"
                style={{
                  left: '50%',
                  top: `${(1800 / 2100) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CubeCanvas progress={progressRef.current} />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-4 text-center font-body text-sm text-muted"
                >
                  Every product passes through the same orbit.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-center font-body text-xs text-crimson-500/70"
                >
                  Strategy to analytics. Architecture to experience.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile cards — stacked below orbit, visible below lg */}
        <div className="mt-4 w-full px-4 lg:hidden">
          {orbitNodes.map((node, i) => (
            <AnimatePresence key={node.id}>
              {activeIdx >= i && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="mb-4"
                >
                  <div className="glass rounded-2xl border border-white/5 p-5 backdrop-blur-xl">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-crimson-500/10 text-crimson-500">
                        <OrbitIcon iconKey={node.iconKey} />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] tracking-widest text-crimson-500/60">
                          {String(node.id).padStart(2, '0')}
                        </div>
                        <h3 className="font-body text-sm font-semibold text-text">
                          {node.label}
                        </h3>
                      </div>
                    </div>
                    <p className="mb-3 font-body text-xs leading-relaxed text-muted">
                      {node.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {node.metrics.map((m) => (
                        <span
                          key={m}
                          className="rounded-full border border-crimson-500/20 bg-crimson-500/5 px-2 py-0.5 font-mono text-[10px] text-crimson-500/80"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        </div>
    </section>
  );
}
