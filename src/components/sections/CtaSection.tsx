import { motion } from 'framer-motion';
import { EnergyOrb } from '../effects/EnergyOrb';
import { Button } from '../foundation/Button';
import { Badge } from '../foundation/Badge';
import { useContactModal } from '../../lib/contactContext';
import { EASE } from '../../lib/utils';

export function CtaSection() {
  const { setOpen } = useContactModal();
  return (
    <section
      id="contact"
      className="relative flex min-h-[500px] items-center justify-center overflow-hidden py-20 md:min-h-[700px] md:py-32"
    >
      {/* Energy vortex background */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 700, height: 700, opacity: 0.4 }}
      >
        <EnergyOrb variant="vortex" className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#080205_70%)]" />

      <div className="container-content relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex justify-center"
        >
          <Badge tone="status" dot>
            Let's build
          </Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-text md:mt-8 md:text-7xl"
        >
          Let's build something
          <span className="block text-gradient">extraordinary.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mx-auto mt-6 max-w-xl font-body text-lg text-muted"
        >
          Systems designed with intent. Products engineered to scale. If you're
          building something that matters, let's talk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            magnetic
            onClick={() => setOpen(true)}
            className="min-w-[220px]"
          >
            Start a conversation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
