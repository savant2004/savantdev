import { motion } from 'framer-motion';
import { PixelLogo } from '../effects/PixelLogo';
import { GalaxyBackground } from '../effects/GalaxyBackground';
import { Button } from '../foundation/Button';
import { ScrollIndicator } from '../layout/Navbar';
import { scrollToId } from '../../hooks/useSmoothScroll';
import { EASE } from '../../lib/utils';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background layers — bg-void shows immediately while GalaxyBackground initializes */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-void">
        <GalaxyBackground className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-grid bg-grid opacity-[0.4]" />
        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#080205_85%)]" />
      </div>

      <div className="container-content flex flex-col items-center gap-3">
        {/* COPY */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-3"
        >


          {/* SAVANT pixel wordmark */}
          <motion.p
            variants={item}
            className="font-body text-base font-medium uppercase tracking-[0.3em] text-muted text-center"
          >
            Software Engineer · System Architect · Founder
          </motion.p>
          <motion.div
            variants={item}
            className="relative w-full max-w-[700px]"
          >
            <div className="pointer-events-none absolute -inset-16 rounded-[60px] bg-crimson-500/5 blur-[100px]" />
            <PixelLogo text="SAVANT" fontSize={220} step={5} />
          </motion.div>

          <motion.p
            variants={item}
            className="mx-auto max-w-[520px] font-body text-lg leading-relaxed text-muted/90 md:text-md text-center"
          >
            Architecting digital ecosystems in Arabic and English,
            from pixels to production systems.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              magnetic
              className="h-12 px-6 text-sm"
              onClick={() => scrollToId('work')}
              iconRight={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h10M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              Explore Work
            </Button>
            <Button
              variant="secondary"
              magnetic
              className="h-12 px-6 text-sm"
              onClick={() => scrollToId('journey')}
              iconRight={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 3.5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            >
              View Journey
            </Button>
          </motion.div>

          
        </motion.div>

      </div>

      <ScrollIndicator />
    </section>
  );
}
