import { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Badge } from '../foundation/Badge';
import type { Project } from '../../data/projects';
import { projects } from '../../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
  className?: string;
}

/**
 * Glassmorphism project card with a 3D tilt that follows the cursor and an
 * animated gradient border. 392×480 base, 24px radius, depth shadow.
 */
export function ProjectCard({ project, index, className }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    setHovered(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group perspective-1000', className)}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="border-animated relative min-h-[420px] w-full overflow-hidden rounded-2xl glass shadow-card sm:min-h-[480px] sm:rounded-3xl"
      >
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20"
            aria-label={`View ${project.title}`}
          />
        ) : project.private ? (
          <button
            onClick={() => setShowPopup(true)}
            className="absolute inset-0 z-20 cursor-pointer"
            aria-label={`View ${project.title}`}
          />
        ) : null}

        {/* Accent glow that intensifies on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${project.accent}33, transparent 60%)`,
          }}
        />

        <div className="relative flex h-full flex-col p-5 sm:p-7" style={{ transform: 'translateZ(40px)' }}>
          {/* Header */}
          <div className="flex items-start justify-between">
            <span className="font-body text-xs uppercase tracking-[0.2em] text-muted">
              {project.category}
            </span>
            <span
              className="font-display text-sm font-semibold"
              style={{ color: project.accent }}
            >
              {project.year}
            </span>
          </div>

          {/* Preview — project image or abstract surface */}
          <div
            className="relative mt-5 w-full overflow-hidden rounded-2xl border border-primary/10 bg-bg/50"
            style={{ aspectRatio: '1536/1024', transform: 'translateZ(20px)' }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${project.accent}, transparent 70%)`,
                  }}
                />
                <div className="relative grid grid-cols-5 gap-1.5 opacity-70">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2.5 w-2.5 rounded-[2px] transition-all duration-500"
                      style={{
                        background: i % 3 === 0 ? project.accent : 'transparent',
                        border: `1px solid ${project.accent}44`,
                        opacity: hovered ? (i % 3 === 0 ? 1 : 0.3) : 0.4,
                      }}
                    />
                  ))}
                </div>
                <span
                  className="absolute bottom-3 right-3 font-display text-2xl font-bold opacity-20"
                  style={{ color: project.accent }}
                >
                  {project.title.charAt(0)}
                </span>
              </>
            )}
          </div>

          {/* Title + metric */}
          <div className="mt-5 flex items-center justify-between">
            <h3 className="font-display text-2xl font-semibold text-text">
              {project.title}
            </h3>
          </div>
          <p className="mt-1 font-body text-sm text-muted">{project.metric}</p>

          {/* Description */}
          <p className="mt-3 font-body text-sm leading-relaxed text-muted/90">
            {project.description}
          </p>

          {/* Stack badges */}
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.stack.map((tech) => (
              <Badge key={tech} tone="stack" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Private project popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="mx-4 max-w-sm rounded-3xl border border-white/5 bg-void p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {project.similarTo ? (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-crimson-500/10 text-crimson-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text">Private Project</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                    This project is private. Check out a similar project that is publicly available:
                  </p>
                  {(() => {
                    const similar = projects.find((p) => p.slug === project.similarTo);
                    if (!similar) return null;
                    return (
                      <a
                        href={similar.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.05]"
                      >
                        {similar.image && (
                          <img src={similar.image} alt="" className="h-12 w-16 rounded-lg object-cover" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-body text-sm font-medium text-text">{similar.title}</div>
                          <div className="font-body text-xs text-muted">{similar.category}</div>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-muted">
                          <path d="M7 17l9-9M16 8v8" />
                        </svg>
                      </a>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ember-500/10 text-ember-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 16v-4" />
                      <circle cx="12" cy="8" r="0.5" fill="currentColor" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-text">Private Project</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted">
                    This project is private and under review. Request a demo to see it in action.
                  </p>
                  <a
                    href="https://wa.me/9647760552004?text=Hi%20Savant%2C%20I'd%20like%20to%20request%20a%20demo%20of%20Dentalyzer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-crimson-500 py-2.5 font-body text-sm font-medium text-white transition-colors hover:bg-crimson-600"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Request a Demo
                  </a>
                </>
              )}
              <button
                onClick={() => setShowPopup(false)}
                className="mt-3 w-full rounded-xl bg-white/5 py-2 font-body text-xs text-muted transition-colors hover:bg-white/10"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
