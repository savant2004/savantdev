import { motion } from 'framer-motion';
import { SectionShell } from '../foundation/SectionShell';
import { scrollToId } from '../../hooks/useSmoothScroll';
import { useContactModal } from '../../lib/contactContext';
import { EASE } from '../../lib/utils';

const SOCIALS = [
  { label: '+964 776 055 2004', href: 'tel:+9647760552004', glyph: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
  { label: 'husseinalrawi921@gmail.com', href: 'mailto:husseinalrawi921@gmail.com', glyph: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/husseinalrawi-0646b73a1', glyph: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.3 6.5a1.78 1.78 0 0 1-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" /></svg> },
  { label: 'GitHub', href: 'https://github.com/savant2004', glyph: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg> },
];

const FOOTER_NAV = [
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'system', label: 'System' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export function Footer() {
  const { setOpen } = useContactModal();
  return (
    <SectionShell id="footer" className="!py-24">
      <div className="grid gap-12 lg:grid-cols-3 lg:items-start">
        {/* LEFT — Brand */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-md bg-crimson-flame opacity-80 blur-[6px]" />
                <span className="relative font-hero text-base font-bold text-white">S</span>
              </span>
              <span className="font-display text-lg font-semibold text-text">SAVANT</span>
            </div>
            <p className="max-w-xs font-body text-sm leading-relaxed text-muted/80">
              Architecting digital ecosystems that scale businesses and solve real-world problems — from pixels to production systems.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex items-center gap-2 font-body text-sm font-medium text-crimson-500 transition-colors hover:text-crimson-400"
            >
              Start a project
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6h8M6 2l4 4-4 4" />
              </svg>
            </button>
          </motion.div>
        </div>

        {/* CENTER — navigation */}
        <div>
          <div className="mb-3 flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            navigate
          </div>

          <nav className="flex flex-col gap-2.5">
            {FOOTER_NAV.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollToId(l.id)}
                className="group flex w-fit items-center gap-2 font-body text-sm text-muted transition-colors hover:text-text"
              >
                <span className="h-px w-0 bg-crimson-500 transition-all duration-300 group-hover:w-4" />
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        {/* RIGHT — socials */}
        <div>
          <div className="mb-3 flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-crimson-500" />
            connect
          </div>
          <div className="flex flex-col gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center gap-3 font-body text-sm text-muted transition-colors hover:text-text"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-crimson-500 transition-colors group-hover:border-crimson-500/40 group-hover:bg-crimson-500/10">
                  {s.glyph}
                </span>
                <span className="truncate">{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-8 font-body text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} SAVANT. Built pixel by pixel.</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          All systems operational
        </span>
      </div>
    </SectionShell>
  );
}
