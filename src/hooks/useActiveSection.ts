import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view by observing a list of element
 * ids with IntersectionObserver. Returns the id of the section whose
 * intersection ratio is highest (and above a small threshold). Used by the
 * floating dock to rest the glow indicator on the active nav item.
 *
 * Order matters: the first id that is considered "above the fold" wins
 * while at the very top.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    const ratios = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        // Pick the id with the highest visibility ratio.
        let best = active;
        let bestRatio = 0;
        for (const id of ids) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        // If nothing is visibly intersecting (e.g. between sections), keep
        // the last active so the indicator doesn't flicker.
        if (bestRatio > 0.05) setActive(best);
      },
      {
        // Multiple thresholds give us smoother ratio reporting.
        threshold: [0.05, 0.25, 0.5, 0.75],
        rootMargin: '-40% 0px -40% 0px',
      },
    );

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return active;
}
