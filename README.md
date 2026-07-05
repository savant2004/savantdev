# SAVANT — Product Engineering Studio

**#1 Iraqi programmer** — architecting digital ecosystems in Arabic and English, from pixels to production systems.

An award-competitive scrolltelling portfolio built as a living digital ecosystem. Not a portfolio — a journey.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, TypeScript 6 |
| Build | Vite 8, Oxlint |
| Styling | Tailwind CSS 3, PostCSS |
| Animation | Framer Motion 12, GSAP 3 + ScrollTrigger, Lenis (smooth scroll) |
| Canvas | Raw Canvas 2D (all particle/visual effects) |
| Fonts | Pixelify Sans (hero), Archivo Black (display), Inter Variable (body), Jersey 25 (pixel logo) |
| Deployment | Static build (`dist/`), deploy to any static host |

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # type-check + production build
npm run preview   # local preview of production build
npm run lint      # oxlint
```

## Sections Walkthrough

The site is a single-page scrolltelling experience with 8 phases:

| # | Section | Id | What it does |
|---|---------|----|-------------|
| 0 | **Loading Screen** | — | Pixel scatter → SAVANT assembly → terminal boot → fade reveal. Shown once per tab session. |
| 1 | **Hero** | `#top` | Pixel-built SAVANT wordmark (Canvas 2D), GalaxyBackground (multi-layer starfield + nebula + shooting stars), CTAs. Konami code accessible here. |
| 2 | **Featured Ecosystem** | `#ecosystem` | MetroKent story: 3 floating device images with scroll-driven parallax, 6 module list, animated stat bar (count-up numbers). Full-screen image gallery on click. |
| 3 | **System Orbit** | `#system` | SVG Bezier path that draws on scroll, 6 orbiting discipline nodes, floating geometric shapes, mobile card list, final rotating cube convergence. |
| 4 | **Selected Projects** | `#work` | 3 project cards (Savant Learning, MetroKent Eco, Dentalyzer) with 3D tilt, preview images, stack badges, private project popup. |
| 5 | **Journey Timeline** | `#journey` | Vertical alternating timeline with gradient SVG line drawing on scroll, glow dot indicator, particle canvases per milestone, glass cards. |
| 6 | **Let's Build** | `#contact` | CTA with EnergyOrb vortex background, animated badge, heading, button that opens ContactModal. |
| 7 | **Terminal** | — | Interactive terminal between CTA and Footer. 30+ commands (`help`, `whoami`, `projects`, `sudo`, `matrix`, etc.). |
| 8 | **Footer** | `#footer` | Brand card, navigation, social links (phone, email, LinkedIn, GitHub) with SVG icons, system status indicator. |

## Project Structure

```
savant-portfolio/
├── public/                 # Static assets (images, favicon, robots.txt)
│   ├── dentalazer.png
│   ├── mk-dk.png
│   ├── mk-eco.png
│   ├── mk-mobo-1.jpeg
│   ├── mk-mobo-2.png
│   └── savant-learning.png
├── src/
│   ├── main.tsx            # Entry point
│   ├── App.tsx             # Root layout (loading → sections)
│   ├── index.css           # Tailwind + design tokens + utility classes
│   ├── components/
│   │   ├── foundation/     # Reusable primitives
│   │   │   ├── Badge.tsx          # Status/stack badges with dot option
│   │   │   ├── Button.tsx         # Primary/secondary/ghost with magnetic hover
│   │   │   └── SectionShell.tsx   # Section wrapper + Eyebrow + Title
│   │   ├── effects/        # Canvas 2D visual components
│   │   │   ├── CrystalCore.tsx     # Hero voxel crystal (legacy)
│   │   │   ├── EnergyOrb.tsx       # CTA spiral/vortex energy effect
│   │   │   ├── GalaxyBackground.tsx # Hero multi-layer starfield + nebulae + shooting stars
│   │   │   ├── OrbitRings.tsx      # Hero orbiting ring paths
│   │   │   ├── ParticleField.tsx   # Ambient drifting particles (legacy, replaced by Galaxy)
│   │   │   └── PixelLogo.tsx       # Canvas pixel-wordmark (hero + loading + scatter)
│   │   ├── layout/         # App chrome
│   │   │   ├── Navbar.tsx          # Floating dock with sliding glow + scroll indicator
│   │   │   ├── LoadingScreen.tsx   # Full-screen 6-scene intro + font preloading
│   │   │   └── KonamiOverlay.tsx   # "ACCESS GRANTED" hacker mode
│   │   ├── sections/       # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedEcosystem.tsx
│   │   │   ├── SystemOrbit.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── TerminalSection.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/             # Composite UI components
│   │       ├── ContactModal.tsx    # WhatsApp-based contact form modal
│   │       ├── DeviceMock.tsx      # Phone/laptop mockups (styled HTML)
│   │       ├── ProjectCard.tsx     # 3D tilt glass card with image/glow/badges
│   │       ├── StatBar.tsx         # Count-up stats with easeOutExpo animation
│   │       └── Terminal.tsx        # Interactive terminal with 30+ commands
│   ├── data/               # Static content
│   │   ├── projects.ts     # Project metadata (title, stack, images, private flag)
│   │   ├── timeline.ts     # Journey milestones
│   │   ├── stats.ts        # Ecosystem statistics
│   │   └── orbitNodes.tsx  # System orbit node definitions
│   ├── hooks/              # Custom React hooks
│   │   ├── useSmoothScroll.ts  # Lenis initialization + scrollToId helper
│   │   ├── useCanvas.ts        # High-DPI canvas RAF loop (auto-pause offscreen)
│   │   ├── useMagnetic.ts      # Framer Motion spring-based magnetic hover
│   │   ├── useKonamiCode.ts    # Konami code (↑↑↓↓←→←→BA) listener
│   │   ├── useActiveSection.ts # IntersectionObserver-based section tracking
│   │   └── usePrefersReducedMotion.ts
│   └── lib/                # Utilities
│       ├── contactContext.tsx  # React context for ContactModal state
│       ├── pixelText.ts        # Canvas-based text pixel sampler
│       └── utils.ts            # cn(), EASE, clamp, lerp
├── resurses/               # Design planning docs (Arabic)
│   ├── ana.md              # Full scrolltelling spec (Arabic)
│   ├── plan.md             # Section ordering
│   ├── components.md       # Component specs
│   ├── design.md, colors.md, typography.md, animations.md, figma-structure.md
├── docs/                   # Technical documentation
├── index.html              # HTML shell with SEO meta tags
├── tailwind.config.js      # Full design token system
├── vite.config.ts          # Vite config with manual chunks
├── tsconfig*.json
└── .gitignore
```

## Design System

### Colors — Crimson Reactor Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#080205` | Void background |
| `surface` | `#120406` | Card surface |
| `crimson-900` | `#5A0008` | Deep accent |
| `crimson-700` | `#A4161A` | Secondary accent |
| `crimson-500` | `#DC143C` | Primary brand accent |
| `crimson-400` | `#E5383B` | Highlight |
| `ember` | `#FF6B35` | Warm accent |
| `gold` | `#FFB000` | Premium accent |
| `text` | `#FFF8F3` | Body text |
| `muted` | `#C9B8B8` | Muted text |

### Typography

| Role | Font | Weight |
|------|------|--------|
| Hero wordmark | Pixelify Sans | 700 |
| Display headings | Archivo Black | 400 |
| Body | Inter Variable | 400/600 |
| Mono (terminal) | Archivo Black / system | — |

### Spacing

- Grid: 12-column, 1280px content (`max-w-content`), responsive padding
- Section spacing: `py-24 md:py-32 lg:py-40` (`160px` at desktop)

### CSS Utilities

- `.container-content` — centered 1280px container
- `.glass` / `.glass-strong` — glassmorphism panels
- `.text-gradient` — Crimson Flame gradient text
- `.border-animated` — animated gradient border wrapper
- `.perspective-1000` / `.preserve-3d` — 3D tilt cards
- `.no-scrollbar` — hidden scrollbar but functional

## Motion Architecture

Three animation libraries work together:

1. **Lenis** — smooth scroll interpolation (1.1s duration, exponential ease). Integrated with GSAP ScrollTrigger.
2. **GSAP + ScrollTrigger** — SVG path draw-on-scroll (SystemOrbit path, Timeline line), orb rotation, timeline reveal. Used for animation that needs precise scroll-based progress.
3. **Framer Motion** — component enter/exit animations, magnetic buttons, card tilt, spring-based navbar glow, AnimatePresence modals.
4. **Canvas 2D** — all particle/visual effects (PixelLogo, GalaxyBackground, EnergyOrb, ParticleField, LoadingScreen ambient) via the `useCanvas` hook.
5. **`prefers-reduced-motion`** — all heavy Canvas/particle work is gated; static fallbacks render one frame.

## Canvas Effects

| Component | Description | DPR |
|-----------|-------------|-----|
| `PixelLogo` | Text sampled into glowing LED pixels. Idle: assembled + mouse repel + click scatter. Loading: 6-scene choreography (flicker → swarm → wave → assemble → breathe → boot). | Capped at 2x |
| `GalaxyBackground` | 3-layer star field (bg/mid/bright), nebula clouds, shooting stars. | Capped at 2x |
| `EnergyOrb` | CTA spiral/vortex animated energy effect. | Capped at 2x |
| `LoadingScreen` | Ambient floating particles + falling squares behind wordmark. | Capped at 2x |
| `SystemOrbit` | Rotating cube canvas (convergence) + falling squares background. | Capped at 2x |
| `Timeline` | Per-milestone particle canvases (small drifting dots). | Capped at 2x |

## Easter Eggs

- **Konami Code** — Type `↑↑↓↓←→←→BA` to unlock "ACCESS GRANTED" hacker overlay.
- **Click the SAVANT wordmark** — pixels scatter and reassemble.
- **Footer terminal** — Type `help`, `whoami`, `projects`, `sudo`, `matrix`, `joke`, `quote`, `clear`.

## SEO

The site targets Iraqi programming and Arabic development keywords:

- `<title>`: SAVANT — #1 Iraqi Programming & Development
- `<meta name="description">`: #1 Iraqi programmer and software engineer...
- `<meta name="keywords">`: Iraqi programmer, Iraqi developer, programming in Arabic, software engineer Iraq...
- `robots.txt` in `public/robots.txt`: Allows all crawlers.
- Semantic section ids (`#top`, `#ecosystem`, `#system`, `#work`, `#journey`, `#contact`).

## Performance

- Manual chunk splitting: `framer-motion`, `gsap`, `lenis` in separate chunks
- DPR-capped canvas rendering (max 2x)
- `IntersectionObserver` auto-pauses canvas loops when offscreen
- Loading screen font preloading via `<link rel="preload">`
- `sessionStorage` guard: loading screen only once per tab session
- Images use `loading="lazy"`

## Deployment

```bash
npm run build   # outputs to dist/
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

Vite config includes `host: true` for network-accessible dev server.

## Branching / Git

- `.gitignore` excludes `node_modules`, `dist`, `*.local`, editor files
- Only commit when explicitly asked — no automatic commits
- Commit messages follow repo style

## Placeholders

- `resume` terminal command says "coming soon" — wire to a real resume URL
- "View All Projects →" (commented intent for future `/work` page)

## License

Private — SAVANT Product Engineering Studio
