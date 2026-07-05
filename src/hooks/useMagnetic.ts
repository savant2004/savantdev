import { useRef, type RefObject } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic hover effect: as the cursor approaches the element it drifts
 * toward the cursor by `strength`, then springs back on leave.
 * Returns a ref to attach + a motion style with x/y springs.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength = 0.35,
) {
  const ref = useRef<T>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref: ref as RefObject<T>,
    motionStyle: { x: springX, y: springY },
    handlers: { onMouseMove: handleMove, onMouseLeave: handleLeave },
  };
}
