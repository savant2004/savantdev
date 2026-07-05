import { motion } from 'framer-motion';
import { Terminal } from '../ui/Terminal';
import { EASE } from '../../lib/utils';

export function TerminalSection() {
  return (
    <section className="relative flex min-h-[400px] items-center justify-center overflow-hidden py-16 md:min-h-[500px] md:py-32">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[300px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-crimson-500/5 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

      <div className="relative z-10 w-full px-4 sm:px-6 md:mx-auto md:max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="w-full text-center"
        >
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
}
