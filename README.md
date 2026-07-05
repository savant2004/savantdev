# SAVANT — Product Engineering Studio

Awwwards-level portfolio built with **React 19**, **Vite 8**, **TypeScript**, **Tailwind CSS 3**, **Framer Motion**, **GSAP ScrollTrigger**, and **Lenis**.

Not a portfolio. A digital ecosystem.

## Quick Start

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Architecture

```
src/
  main.tsx, App.tsx, index.css
  lib/            utils, pixelText sampler
  hooks/          useCanvas, useSmoothScroll, useMagnetic,
                  useKonamiCode, useActiveSection, usePrefersReducedMotion
  components/
    foundation/   Button (primary/secondary/ghost), Badge, SectionShell
    effects/      PixelLogo, CrystalCore, ParticleField,
                  OrbitRings, EnergyOrb
    layout/       Navbar (floating dock), LoadingScreen, KonamiOverlay
    sections/     Hero, FeaturedEcosystem, SystemOrbit,
                  Projects, Timeline, CtaSection, Footer
    ui/           DeviceMock, StatBar, ProjectCard
  data/           projects, stats, timeline, orbitNodes
```

## Sections

| # | Section | What it does |
|---|---------|-------------|
| 0 | **Loading Screen** | Pixel scatter → SAVANT assembly → terminal boot → explosion (once per session) |
| 1 | **Hero** | Pixel-built SAVANT wordmark + procedural Crystal Core + orbit rings |
| 2 | **Featured Ecosystem** | MetroKent story with 6 modules, floating devices, animated stats |
| 3 | **System Orbit** | Central energy orb + 6 SVG-drawing connection lines to nodes |
| 4 | **Selected Projects** | MetroKent, Savant Quizzes, Dentalyzer — 3D-tilt glass cards |
| 5 | **Journey Timeline** | Horizontal SVG-draw path with pulsing year nodes |
| 6 | **Let's Build** | CTA with animated energy vortex background |
| 7 | **Footer Terminal** | Terminal-styled footer with interactive command input |

## Motion System

- **Lenis** — smooth scroll, integrated with GSAP ScrollTrigger
- **Framer Motion** — component animations, magnetic buttons, card tilt, spring-based nav glow
- **GSAP ScrollTrigger** — SVG path draw-on-scroll, orb rotation, timeline reveal
- **Canvas 2D** — all particle/crystal effects (PixelLogo, CrystalCore, ParticleField, EnergyOrb, LoadingScreen)
- **`prefers-reduced-motion`** — all heavy Canvas/particle work is gated; static fallbacks

## Design Tokens

All tokens live in `tailwind.config.js` + CSS custom properties (`index.css`):

- **Palette:** `#05010D` bg → `#8B5CF6` purple → `#D946EF` magenta → `#EC4899` pink → `#F8FAFC` text
- **Fonts:** Pixelify Sans (hero), Clash Display (display headings), Inter Variable (body)
- **Spacing:** 4 → 8 → 12 → 16 → 24 → 32 → 48 → 64 → 96 → 128 → 160px
- **Grid:** 12-column, 1280px content, 80px margins, 24px gutters

## Easter Eggs

- **Konami code** (↑↑↓↓←→←→ B A) — unlocks a hidden "ACCESS GRANTED" overlay
- **Click the SAVANT wordmark** — pixels scatter and reassemble
- **Footer terminal** — type `help`, `whoami`, `projects`, `metrokent`, `resume`, `sudo`, `clear`

## Placeholders (fill before shipping)

- `Footer.tsx` — GitHub, LinkedIn, Email social links are `href="#"` — replace with real URLs
- `Footer.tsx` — `resume` command says "coming soon" — wire to a real résumé
- `Projects.tsx` — "View All Projects →" will navigate to `/work` once the projects page is built

## Next Phase

- [ ] Add `react-router-dom` + `/work` page (masonry grid + filters)
- [ ] Add `/work/:slug` project detail pages (architecture diagrams, screenshots, metrics)
- [ ] Cross-section particle transitions (data-stream effect between sections)
