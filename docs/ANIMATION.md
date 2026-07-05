# SAVANT — Motion & Animation System

## Library Responsibilities

### Lenis (smooth scroll)

- Singleton initialized once in `useSmoothScroll()` at the App root
- Duration: 1.1s, easing: `1.001 - 2^(-10t)` (exponential ease-out)
- Integrated with GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
- Frame loop driven by `gsap.ticker.add()` for sync
- Stored on `window.__lenis` for external access (e.g. `scrollToId`)
- Skipped entirely when `prefers-reduced-motion: reduce`

### GSAP + ScrollTrigger

Used for scroll-driven animations that need precise progress-based control:

| Animation | File | Mechanism |
|-----------|------|-----------|
| SystemOrbit SVG path draw | `SystemOrbit.tsx` | `ScrollTrigger` scrub + `strokeDashoffset` → 0. 1.2s scrub lag. |
| SystemOrbit node glow states | `SystemOrbit.tsx` | `onUpdate` callback maps progress to node opacity/scale/filter per node. |
| SystemOrbit floating shapes | `SystemOrbit.tsx` | Sin/cos offset based on progress + per-shape speed/delay. |
| SystemOrbit train dots | `SystemOrbit.tsx` | `path.getPointAtLength()` positions circles along path at current draw length. |
| Timeline SVG line draw | `Timeline.tsx` | `ScrollTrigger` scrub + `strokeDashoffset` animation on `.journey-line-fill`. |

**Pattern**: `useGSAP(() => { ... }, { scope: sectionRef })` with cleanup that kills both timeline and ScrollTrigger.

### Framer Motion

Used for all component-level enter/exit/spring animations:

| Pattern | Usage |
|---------|-------|
| `whileInView` | Section elements animate on scroll (eyebrow, title, cards, buttons) |
| `AnimatePresence` | Modals, popups, overlays, conditionally rendered cards |
| `variants` + `staggerChildren` | Hero title/subtitle/buttons stagger |
| `useScroll` + `useTransform` | FeaturedEcosystem parallax offsets |
| `useMotionValue` + `useSpring` | ProjectCard 3D tilt (rotateX/rotateY mapped to cursor) |
| `layoutId` | Navbar sliding glow indicator |
| `magnetic` | Buttons with spring-based cursor tracking |

**Easing**: All Framer Motion animations use `[0.22, 1, 0.36, 1]` (the `EASE` constant from `utils.ts`).

### Canvas 2D

All canvas effects run their own rAF loops (see [CANVAS.md](CANVAS.md)).

## Animation Flow By Section

### Loading Screen (6 scenes)

Timeline driven by `PixelLogo.tsx` internal state machine:

1. **Flicker** (0-450ms): Random subset of pixels visible, subtle jitter
2. **Swarm** (450-950ms): Pixels gently pulled toward target positions + sine wave Y
3. **Wave** (950-1450ms): Horizontal lane wave traveling right, wrapping
4. **Assemble** (1450-2050ms): Spring tighten into target positions
5. **Breathe** (2050-2900ms): Pixels locked, sinusoidal alpha breathing
6. **Boot** (2050ms+): Terminal lines appear every 150ms

Exit: Fade out overlay (700ms), reveals hero beneath.

### Hero

- `GalaxyBackground` runs continuously
- `PixelLogo` in `idle` mode: assembled + breathe + mouse repel + click scatter
- CTAs stagger in via `variants.container` + `variants.item` (0.12s delay between children)

### FeaturedEcosystem

- 3 device images with independent floating animations (`animate={{ y: [0, -N, 0] }}`)
- Scroll-driven parallax via `useScroll` + `useTransform`: phones drift apart, laptop shifts Y
- 6 modules stagger in left-to-right
- StatBar count-up via `useCountUp` (easeOutExpo, 1800ms) triggered by `useInView`

### SystemOrbit

- SVG Bezier path draws on scroll via GSAP `strokeDashoffset` scrub
- 6 HTML node elements glow/scale based on distance from scroll progress threshold
- Pulse ring expands on node activation (Framer Motion `AnimatePresence`)
- Content cards fade in for each completed node
- Floating shapes drift via GSAP `onUpdate` sine/cosine offset
- Train dots travel along drawn path
- CubeCanvas rotates (3D wireframe, auto rotation)
- Final "Every product passes through..." text appears when `p > 0.6`

### Projects

- 3 cards fade in staggered by index × 0.12s delay
- 3D tilt on mouse move: `rotateX / rotateY` springs from cursor position
- Image hover scale: `group-hover:scale-105`
- Private project: AnimatePresence popup modal

### Timeline

- Central SVG vertical line draws on scroll (GSAP scrub)
- Milestone cards animate in on intersection (fade + slide opposing directions)
- Per-card particle canvas runs continuously
- Glow dot indicator tracks progress along central line

### CTA

- EnergyOrb vortex canvas runs continuously
- Badge, heading, paragraph, button animate in via `whileInView` with increasing delays

### Terminal

- Boot lines fade in sequentially on view
- Terminal expand/collapse via Framer Motion `AnimatePresence` + height animation
- Command history scrolls to bottom on new entries

## Reduced Motion

When `prefers-reduced-motion: reduce`:

- All canvas effects render one static frame and stop (`useCanvas` bail-out)
- Lenis is not initialized (native scroll)
- LoadingScreen skips entirely
- GSAP ScrollTrigger/animations are suppressed
- CSS `* { animation-duration: 0.01ms !important }` kills Tailwind animations
