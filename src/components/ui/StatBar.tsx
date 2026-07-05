import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Stat } from '../../data/stats';

/** Count-up animation that triggers when scrolled into view. */
function useCountUp(target: number, decimals = 0, run: boolean, dur = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
}

function StatItem({ stat, index, run }: { stat: Stat; index: number; run: boolean }) {
  const display = useCountUp(stat.value ?? 0, stat.decimals ?? 0, run);
  const value = stat.literal ?? `${stat.prefix ?? ''}${display}${stat.suffix ?? ''}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex flex-col items-center justify-center px-4 text-center"
    >
      <div className="font-display text-3xl font-semibold text-gradient md:text-4xl">
        {value}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
        {stat.label}
      </div>
    </motion.div>
  );
}

interface StatBarProps {
  stats: Stat[];
  className?: string;
}

export function StatBar({ stats, className }: StatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className={cn(
        'glass grid grid-cols-2 gap-y-10 rounded-3xl py-8 md:grid-cols-5',
        className,
      )}
    >
      {stats.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} index={i} run={inView} />
      ))}
    </div>
  );
}
