import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useKonamiCode } from '../../hooks/useKonamiCode';

/**
 * Easter egg: entering the Konami code toggles a hidden "hacker mode" overlay
 * that briefly flashes a green matrix-style banner across the screen.
 */
export function KonamiOverlay() {
  const [active, setActive] = useState(false);

  const trigger = useCallback(() => {
    setActive(true);
    window.setTimeout(() => setActive(false), 3200);
  }, []);

  useKonamiCode(trigger);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            className="relative text-center"
          >
            <div className="font-hero text-5xl font-bold text-emerald-400 md:text-7xl" style={{ textShadow: '0 0 30px rgba(52,211,153,0.6)' }}>
              ACCESS GRANTED
            </div>
            <div className="mt-4 font-mono text-sm text-emerald-300/80">
              [ hacker mode unlocked — you found the secret ]
            </div>
            <div className="mx-auto mt-6 h-px w-64 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
