# SAVANT — Architecture

## Overview

Single-page React 19 application. Sections are stacked vertically with Lenis-powered smooth scrolling. Canvas 2D effects run in parallel rAF loops, gated by IntersectionObserver and `prefers-reduced-motion`.

## Component Tree

```
<App>
  <ContactProvider>
    <LoadingScreen />               (once per session, mode="loading")
    <AppInner>
      <Navbar />                     (floating dock, section-agnostic)
      <main>
        <Hero />                     (#top)
        <FeaturedEcosystem />        (#ecosystem)
        <SystemOrbit />              (#system)
        <Projects />                 (#work)
        <Timeline />                 (#journey)
        <CtaSection />               (#contact)
        <TerminalSection />
        <Footer />                   (#footer)
      </main>
      <KonamiOverlay />
      <ContactModal />
    </AppInner>
  </ContactProvider>
</App>
```

## Foundation Components

| Component | File | Props | Notes |
|-----------|------|-------|-------|
| `Button` | `foundation/Button.tsx` | `variant`, `size`, `magnetic`, `iconLeft/Right` | Framer Motion `motion.button`, optional magnetic hover |
| `Badge` | `foundation/Badge.tsx` | `tone`, `dot` | Animated on view, 3 tones (default/status/stack) |
| `SectionShell` | `foundation/SectionShell.tsx` | `id`, `className` | Standard padding + centered container |
| `SectionEyebrow` | `foundation/SectionShell.tsx` | — | Animated eyebrow label with crimson line |
| `SectionTitle` | `foundation/SectionShell.tsx` | — | Animated `h2` with fade+slide |

## Section Components

| Section | Id | Key Features |
|---------|----|-------------|
| `Hero` | `#top` | GalaxyBackground (canvas), PixelLogo (canvas), stagger animation, 2 CTAs |
| `FeaturedEcosystem` | `#ecosystem` | Parallax devices via `useScroll` transforms, image gallery modal, StatBar count-up |
| `SystemOrbit` | `#system` | GSAP ScrollTrigger SVG path draw, node glow states, floating shapes, CubeCanvas, mobile card list |
| `Projects` | `#work` | ProjectCard grid (3 items), private project popup, CTA link |
| `Timeline` | `#journey` | Vertical alternating layout, central SVG line draw, per-milestone canvas particles |
| `CtaSection` | `#contact` | EnergyOrb vortex background, badge + heading + button → ContactModal |
| `TerminalSection` | — | Wrapper centering the Terminal component, `max-w-3xl` desktop |
| `Footer` | `#footer` | 3-col grid: brand, nav, socials (SVG icons), "Start a project" button |

## UI Components

| Component | File | Purpose |
|-----------|------|---------|
| `ContactModal` | `ui/ContactModal.tsx` | Name/email/message form → WhatsApp redirect. React context driven. |
| `Terminal` | `ui/Terminal.tsx` | Windowed terminal with boot lines, 30+ commands, history. |
| `ProjectCard` | `ui/ProjectCard.tsx` | 3D tilt via Framer Motion springs, image preview, stack badges, private popup. |
| `DeviceMock` | `ui/DeviceMock.tsx` | Phone/laptop mockups as styled HTML (no images). |
| `StatBar` | `ui/StatBar.tsx` | Count-up stats via `useCountUp` (easeOutExpo). |

## Effect Components

| Component | File | Canvas? | Layer |
|-----------|------|---------|-------|
| `PixelLogo` | `effects/PixelLogo.tsx` | Yes (useCanvas) | Hero/loading wordmark |
| `GalaxyBackground` | `effects/GalaxyBackground.tsx` | Yes (raw RAF) | Hero starfield |
| `EnergyOrb` | `effects/EnergyOrb.tsx` | Yes (useCanvas) | CTA vortex |
| `ParticleField` | `effects/ParticleField.tsx` | Yes (useCanvas) | Legacy hero particles |
| `CrystalCore` | `effects/CrystalCore.tsx` | Yes (useCanvas) | Legacy hero crystal |
| `OrbitRings` | `effects/OrbitRings.tsx` | SVG | Legacy hero rings |

## Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useSmoothScroll` | `hooks/useSmoothScroll.ts` | Initializes Lenis, integrates with GSAP ticker. Exports `scrollToId()`. |
| `useCanvas` | `hooks/useCanvas.ts` | Sets up high-DPI canvas, rAF loop, auto-pause offscreen via IntersectionObserver. |
| `useMagnetic` | `hooks/useMagnetic.ts` | Framer Motion spring-based mouse-tracking offset. Returns ref + handlers. |
| `useKonamiCode` | `hooks/useKonamiCode.ts` | Listens for ↑↑↓↓←→←→BA sequence, fires callback once. |
| `useActiveSection` | `hooks/useActiveSection.ts` | Tracks highest-visibility section via IntersectionObserver. |
| `usePrefersReducedMotion` | `hooks/usePrefersReducedMotion.ts` | Tracks OS-level reduced-motion preference. |

## Data Layer

| File | Exports | Schema |
|------|---------|--------|
| `data/projects.ts` | `projects: Project[]` | `{ slug, title, category, description, stack, accent, year, metric, href?, image?, private? }` |
| `data/timeline.ts` | `timeline: TimelineNode[]` | `{ year, title, description, metrics[], impact }` |
| `data/stats.ts` | `ecosystemStats: Stat[]` | `{ label, value?, suffix?, prefix?, decimals?, literal? }` |
| `data/orbitNodes.tsx` | `orbitNodes: OrbitNode[]` | `{ id, label, desc, x, y, side, metrics[], iconKey }` |

## Utilities

| File | Exports |
|------|---------|
| `lib/utils.ts` | `cn()` (clsx + tailwind-merge), `EASE` constant, `clamp()`, `lerp()`, `motionTransition()` |
| `lib/pixelText.ts` | `sampleTextPixels()` — renders text to offscreen canvas, samples opaque pixels with position + hue gradient |
| `lib/contactContext.tsx` | `ContactProvider`, `useContactModal` — manages ContactModal open/close state globally |

## Styling Architecture

- **Tailwind CSS 3** as primary styling system
- **`index.css`** — `@tailwind` directives, CSS custom properties (`:root`), `@layer base/components/utilities`
- **`tailwind.config.js`** — full design token system (colors, fonts, spacing, shadows, gradients, keyframes)
- **`cn()` utility** — `clsx` + `tailwind-merge` for conditional class merging
- **Glass utilities** — `.glass` / `.glass-strong` classes in `index.css` (backdrop-blur + gradient border)
- **Text gradient** — `.text-gradient` uses crimson-ember-gold linear gradient
- **Animated border** — `.border-animated` pseudo-element with moving gradient

## SEO

- `index.html` has full meta tags: title, description, OG, keywords targeting Iraqi programming
- `public/robots.txt` — allows all crawlers
- Semantic `id` attributes on each section for anchor navigation
