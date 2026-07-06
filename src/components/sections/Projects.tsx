import { SectionShell, SectionEyebrow, SectionTitle } from '../foundation/SectionShell';
import { ProjectCard } from '../ui/ProjectCard';
import { projects } from '../../data/projects';
import { scrollToId } from '../../hooks/useSmoothScroll';

export function Projects() {
  return (
    <SectionShell id="work" className="pb-0">
      <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionEyebrow>Selected Work</SectionEyebrow>
          <SectionTitle>
            Products that
            <span className="text-gradient"> ship & scale.</span>
          </SectionTitle>
        </div>
        <p className="max-w-sm font-body text-muted">
          A focused selection of systems built end-to-end — from first
          architecture sketch to production at scale.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.filter((p) => !p.hidden).map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <button
          onClick={() => scrollToId('contact')}
          className="group inline-flex items-center gap-2 font-body text-sm text-muted transition-colors hover:text-text"
        >
          Want to build the next one?
          <span className="text-crimson-500 transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </SectionShell>
  );
}
