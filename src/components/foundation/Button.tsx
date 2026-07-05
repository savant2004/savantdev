import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useMagnetic } from '../../hooks/useMagnetic';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  /** Enable magnetic hover drift. Default false. */
  magnetic?: boolean;
  /** Optional leading icon node. */
  iconLeft?: React.ReactNode;
  /** Optional trailing icon node. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

const base =
  'relative inline-flex items-center justify-center gap-2 rounded-full font-body font-medium tracking-tight transition-colors duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'text-white shadow-glow hover:shadow-glow-strong bg-crimson-flame bg-[length:200%_200%] hover:bg-[position:100%_100%]',
  secondary:
    'glass-strong text-text hover:border-crimson-500/40 hover:text-white',
  ghost:
    'text-muted hover:text-text hover:bg-primary/10',
};

const sizes: Record<Size, string> = {
  // md = the 220x64 spec; lg for hero CTAs
  md: 'h-16 px-8 text-base',
  lg: 'h-16 px-10 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      magnetic = false,
      iconLeft,
      iconRight,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const magneticHook = useMagnetic<HTMLButtonElement>(0.3);

    const refToUse = magnetic ? magneticHook.ref : undefined;
    const motionStyle = magnetic ? magneticHook.motionStyle : undefined;
    const handlers = magnetic ? magneticHook.handlers : undefined;

    // Merge forwarded ref with magnetic ref
    const setRefs = (node: HTMLButtonElement | null) => {
      if (refToUse) {
        (refToUse as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
      }
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current =
          node;
    };

    return (
      <motion.button
        ref={setRefs}
        style={motionStyle}
        whileTap={{ scale: 0.96 }}
        className={cn(base, variants[variant], sizes[size], className)}
        {...handlers}
        {...props}
      >
        {variant === 'primary' && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--x,50%) var(--y,50%), rgba(255,255,255,0.25), transparent 60%)',
            }}
          />
        )}
        {iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
        {children && <span className="relative">{children}</span>}
        {iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
