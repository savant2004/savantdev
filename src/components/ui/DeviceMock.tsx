import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type DeviceType = 'phone' | 'laptop';

interface DeviceMockProps {
  type: DeviceType;
  /** Label shown on the device screen header. */
  label: string;
  className?: string;
  /** Float animation delay. */
  delay?: number;
  /** Accent tint. */
  accent?: string;
}

/**
 * Lightweight device mockups (phone + laptop) rendered as styled HTML.
 * Each shows a stylised app UI surface rather than a screenshot, keeping
 * the bundle image-free. Phones are 180×360, laptops are 640×400 per spec.
 */
export function DeviceMock({
  type,
  label,
  className,
  delay = 0,
  accent = '#DC143C',
}: DeviceMockProps) {
  if (type === 'phone') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        animate={{ y: [0, -14, 0] }}
        className={cn('relative', className)}
        style={{
          width: 180,
          height: 360,
          animationDuration: '6s',
        }}
      >
        <div className="relative h-full w-full rounded-[2rem] border border-primary/30 bg-surface p-1.5 shadow-card">
          <div
            className="absolute -inset-4 -z-10 rounded-[2.5rem] opacity-40 blur-2xl"
            style={{ background: accent }}
          />
          {/* Notch */}
          <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-primary/40" />
          <div className="mt-2 flex h-[calc(100%-2rem)] flex-col gap-2 rounded-[1.6rem] bg-bg/80 p-2.5">
            <div className="flex items-center justify-between">
              <span
                className="text-[9px] font-semibold tracking-wide"
                style={{ color: accent }}
              >
                {label}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            {/* Fake content blocks */}
            <div className="mt-1 h-12 rounded-lg" style={{ background: `${accent}33` }} />
            <div className="space-y-1.5">
              <div className="h-2 w-3/4 rounded bg-muted/30" />
              <div className="h-2 w-1/2 rounded bg-muted/20" />
            </div>
            <div className="mt-auto grid grid-cols-2 gap-1.5">
              <div className="h-8 rounded-md" style={{ background: `${accent}22` }} />
              <div className="h-8 rounded-md" style={{ background: `${accent}22` }} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Laptop
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('relative', className)}
      style={{ width: '100%', maxWidth: 640 }}
    >
      <div
        className="absolute -inset-6 -z-10 opacity-30 blur-3xl"
        style={{ background: accent }}
      />
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-surface shadow-card">
        <div className="flex items-center gap-1.5 border-b border-primary/10 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-crimson-700/60" />
          <span className="h-2 w-2 rounded-full bg-crimson-500/60" />
          <span className="h-2 w-2 rounded-full bg-crimson-400/60" />
          <span className="ml-3 text-[10px] font-medium tracking-wide text-muted">
            {label} — operations
          </span>
        </div>
        <div
          className="grid grid-cols-12 gap-3 p-4"
          style={{ height: 320 }}
        >
          {/* Sidebar */}
          <div className="col-span-3 flex flex-col gap-2 rounded-xl border border-primary/10 bg-bg/60 p-3">
            <div className="h-3 w-3/4 rounded" style={{ background: accent }} />
            <div className="mt-2 space-y-1.5">
              <div className="h-2 w-full rounded bg-muted/20" />
              <div className="h-2 w-2/3 rounded bg-muted/15" />
              <div className="h-2 w-4/5 rounded bg-muted/15" />
              <div className="h-2 w-1/2 rounded bg-muted/15" />
            </div>
          </div>
          {/* Main */}
          <div className="col-span-9 flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              {['12.4k', '99.9%', '84ms'].map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-primary/10 bg-bg/60 p-3"
                >
                  <div
                    className="font-display text-lg font-semibold"
                    style={{ color: accent }}
                  >
                    {s}
                  </div>
                  <div className="mt-1 h-1.5 w-2/3 rounded bg-muted/20" />
                </div>
              ))}
            </div>
            <div className="flex flex-1 items-end gap-2 rounded-xl border border-primary/10 bg-bg/60 p-3">
              {[40, 65, 35, 80, 55, 90, 70, 60, 95, 50].map((hgt, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: `${hgt}%`,
                    background: `linear-gradient(180deg, ${accent}, transparent)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Laptop base */}
      <div className="mx-auto h-2 w-[112%] -translate-x-[5%] rounded-b-xl border-x border-b border-primary/20 bg-surface-2" />
    </motion.div>
  );
}
