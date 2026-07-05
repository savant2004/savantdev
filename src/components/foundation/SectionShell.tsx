import { motion } from 'framer-motion';
import { cn, EASE } from '../../lib/utils';

interface SectionShellProps {
  id?: string;
  /** Vertical padding. Defaults to the 160px section gap. */
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}

/**
 * Standard section wrapper: applies the section spacing and a centered
 * 1280px content container. Provides an id anchor for navbar navigation.
 */
export function SectionShell({
  id,
  className,
  containerClassName,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn('relative w-full py-24 md:py-32 lg:py-40', className)}
    >
      <div className={cn('container-content relative z-10', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/** Eyebrow label that animates in on scroll — used above section titles. */
export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        'mb-5 inline-flex items-center gap-3 font-body text-xs font-medium uppercase tracking-[0.25em] text-muted',
        className,
      )}
    >
      <span className="h-px w-8 bg-gradient-to-r from-crimson-500 to-ember" />
      {children}
            <span className="h-px w-8 bg-gradient-to-r from-crimson-500 to-ember" />

    </motion.div>
  );
}

/** Section title with gradient accent. */
export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn(
        'font-display text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl',
        className,
      )}
    >
      {children}
    </motion.h2>
  );
}
