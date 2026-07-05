import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SectionEyebrow } from '../foundation/SectionShell';
import { timeline } from '../../data/timeline';
import { cn, EASE } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function TimelineParticles({ year }: { year: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pts: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * 200,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.05 + Math.random() * 0.15,
      });
    }

    let raf = 0;
    const loop = () => {
      raf = 0;
      ctx.clearRect(0, 0, 200, 200);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = 200;
        if (p.x > 200) p.x = 0;
        if (p.y < 0) p.y = 200;
        if (p.y > 200) p.y = 0;
        ctx.fillStyle = `rgba(220, 20, 60, ${p.alpha})`;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 opacity-40"
    />
  );
}

function MilestoneCard({
  node,
  index,
  scrollProgress,
}: {
  node: (typeof timeline)[number];
  index: number;
  scrollProgress: number;
}) {
  const isLeft = index % 2 === 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex items-center justify-center"
      style={{ minHeight: 320 }}
    >
      <TimelineParticles year={node.year} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 30 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'group relative w-full max-w-lg rounded-3xl border border-white/5 p-5 backdrop-blur-xl transition-all duration-500 sm:p-8',
          isLeft ? 'lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:pl-12',
          'bg-void/80',
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 800,
        }}
      >
        {/* Gradient lighting overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at ${isLeft ? '100%' : '0%'} 50%, rgba(220,20,60,0.12), transparent 60%)`,
          }}
        />

        {/* Year badge */}
        <div className="mb-5 flex items-center gap-3">
          <motion.span
            animate={hovered ? { scale: 1.05 } : { scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full border border-crimson-500/20 bg-crimson-500/10 px-4 py-1.5 font-mono text-sm font-semibold text-crimson-500"
            style={{
              boxShadow: hovered ? '0 0 30px rgba(220,20,60,0.2)' : 'none',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-crimson-500" />
            {node.year}
          </motion.span>
          <div className="h-px flex-1 bg-gradient-to-r from-crimson-500/30 to-transparent" />
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl font-semibold text-text transition-colors duration-300 group-hover:text-white">
          {node.title}
        </h3>

        {/* Description */}
        <p className="mt-3 font-body text-base leading-relaxed text-muted/90">
          {node.description}
        </p>

        {/* Impact */}
        <p className="mt-2 font-body text-sm italic text-crimson-500/70">
          {node.impact}
        </p>

        {/* Metrics */}
        <div className="mt-5 flex flex-wrap gap-2">
          {node.metrics.map((m) => (
            <span
              key={m}
              className="rounded-full border border-crimson-500/15 bg-crimson-500/5 px-3 py-1 font-mono text-[11px] text-crimson-500/80 transition-colors duration-300 group-hover:border-crimson-500/30 group-hover:bg-crimson-500/10"
            >
              {m}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Animate timeline line on scroll
  useGSAP(
    () => {
      const line = timelineRef.current?.querySelector('.journey-line-fill');
      if (!line) return;
      const length = (line as SVGPathElement).getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1,
        onUpdate: (self) => {
          gsap.to(line, { strokeDashoffset: length * (1 - self.progress), duration: 0 });
          setProgress(self.progress);
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="journey" className="relative overflow-hidden bg-void">
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Radial ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-crimson-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-crimson-500/3 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:py-32 lg:py-40">
        {/* Header */}
        <div className="mb-24 text-center">
          <div className="flex justify-center">
            <SectionEyebrow>Founder Journey</SectionEyebrow>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-display text-3xl font-semibold leading-tight tracking-tight text-text sm:text-4xl md:text-5xl"
          >
            From first pixel to{' '}
            <span className="bg-gradient-to-r from-crimson-500 via-crimson-flame to-ember bg-clip-text text-transparent">
              frontier.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl font-body text-lg text-muted/80"
          >
            Every year represented a larger vision, bigger systems, and greater
            impact.
          </motion.p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative mx-auto max-w-5xl">
          {/* Central line */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
            <svg className="h-full w-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="#DC143C"
                strokeOpacity="0.12"
                strokeWidth="1"
              />
              <line
                className="journey-line-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="url(#jl-grad)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="jl-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC143C" />
                  <stop offset="50%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#E5383B" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Central glow dot indicator */}
          <motion.div
            className="pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 lg:block"
            style={{ top: `${progress * 85 + 7.5}%`, opacity }}
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-crimson-500/60" />
              <span className="h-3 w-3 rounded-full bg-crimson-flame shadow-lg shadow-crimson-500/50" />
            </div>
          </motion.div>

          {/* Milestones */}
          <div className="relative z-10 flex flex-col gap-20 lg:gap-40">
            {timeline.map((node, i) => (
              <div key={node.year} className="relative">
                {/* Connector dot on the line */}
                <div className="pointer-events-none absolute left-1/2 top-12 z-10 hidden -translate-x-1/2 lg:block">
                  <div className="flex h-4 w-4 items-center justify-center">
                    <span className="h-2.5 w-2.5 rounded-full border border-crimson-500 bg-void" />
                    <span className="absolute h-full w-full animate-ping rounded-full bg-crimson-500/30" />
                  </div>
                </div>

                <MilestoneCard
                  node={node}
                  index={i}
                  scrollProgress={progress}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-32 text-center"
        >
          <div className="mx-auto max-w-md rounded-3xl border border-white/5 bg-void/50 p-8 backdrop-blur-sm">
            <p className="font-body text-sm text-muted/60">
              From solo projects to ecosystem architecture.
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-text">
              This is only the beginning.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
