import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

type BadgeTone = 'default' | 'status' | 'stack';

interface BadgeProps extends HTMLMotionProps<'span'> {
  tone?: BadgeTone;
  /** Optional pulsing dot indicator (for status badges). */
  dot?: boolean;
  children: React.ReactNode;
}

const tones: Record<BadgeTone, string> = {
  default:
    'border-primary/25 bg-primary/10 text-primary',
  status:
    'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  stack:
    'border-crimson-700/25 bg-crimson-700/10 text-crimson-700',
};

export function Badge({
  tone = 'default',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-body text-xs font-medium tracking-wide backdrop-blur-sm',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
      {children}
    </motion.span>
  );
}
