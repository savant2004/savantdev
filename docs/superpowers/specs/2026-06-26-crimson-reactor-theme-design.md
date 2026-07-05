# SAVANT — Crimson Reactor Theme Design

**Date**: 2026-06-26
**Status**: Approved
**Scope**: Pure color palette migration — zero structural/architectural changes

## Objective

Transform the SAVANT website from its current "Neon Ember" creative-agency aesthetic (warm magenta-coral-gold) to a "Crimson Reactor" high-performance engineering aesthetic (deep crimson-ember-gold on void black). Brand emotion shifts from creative/neon to intelligent/powerful/engineered/precise/premium.

## New Palette

### Background & Surface
| Token | Hex | Role |
|-------|-----|------|
| `--void-black` | `#080205` | Page background (was `#09000F`) |
| `--surface-black` | `#120406` | Card/panel surface (was `#140014`) |

### Crimson Scale
| Token | Hex | Role |
|-------|-----|------|
| `--crimson-900` | `#5A0008` | Deep surface-2 (was `#1A0016`) |
| `--crimson-700` | `#A4161A` | Outer shell / strong accent |
| `--crimson-500` | `#DC143C` | Primary accent / idle state |
| `--crimson-400` | `#E5383B` | Hover midtone |

### Accent
| Token | Hex | Role |
|-------|-----|------|
| `--ember` | `#FF6B35` | Hover state / hot edges |
| `--gold` | `#FFB000` | Active state / energy highlights |

### Text
| Token | Hex | Role |
|-------|-----|------|
| `--text-primary` | `#FFF8F3` | Primary text (was `#F5EFFF`) |
| `--text-secondary` | `#C9B8B8` | Secondary text (was `#94A3B8`) |

## Color Mapping (Old → New)

### Config-level tokens (tailwind.config.js + index.css :root)
| Old Token | Old Value | New Token | New Value |
|-----------|-----------|-----------|-----------|
| `bg` | `#09000F` | `bg` | `#080205` |
| `surface` | `#140014` | `surface` | `#120406` |
| `surface-2` | `#1A0016` | `surface-2` | `#5A0008` |
| `primary.DEFAULT` | `#FF4D8D` | `primary.DEFAULT` | `#DC143C` |
| `primary.600` | `#FF2E78` | `primary.600` | `#A4161A` |
| `pink.DEFAULT` | `#FF4D8D` | `crimson.DEFAULT` | `#DC143C` |
| `pink.600` | `#FF2E78` | `crimson.700` | `#A4161A` |
| `magenta` | `#FF2E78` | `crimson.700` | `#A4161A` |
| `violet` / `coral` | `#FF6B5E` | `ember` | `#FF6B35` |
| `orange` | `#FF8A3D` | `ember` | `#FF6B35` |
| `gold` | `#FFB347` | `gold` | `#FFB000` |
| `text` | `#F5EFFF` | `text` | `#FFF8F3` |
| `muted` | `#94A3B8` | `muted` | `#C9B8B8` |

### Gradients
| Name | Old | New |
|------|-----|-----|
| Main gradient | `135deg, #FF2E78 → #FF4D8D → #FF6B5E → #FFB347` | `90deg, #A4161A → #DC143C → #E5383B → #FF6B35 → #FFB000` |
| Soft glow | `135deg, rgba(255,77,141,0.15) → rgba(255,107,94,0.15) → rgba(255,179,71,0.15)` | `135deg, rgba(220,20,60,0.15) → rgba(255,107,53,0.15) → rgba(255,176,0,0.15)` |
| Radial fade | `circle, rgba(255,77,141,0.18), transparent 70%` | `circle, rgba(220,20,60,0.18), transparent 70%` |
| Grid | `rgba(255,77,141,0.05)` | `rgba(220,20,60,0.05)` |

### Box Shadows
| Name | Old | New |
|------|-----|-----|
| `glow` | `rgba(255,77,141,0.4)` | `rgba(220,20,60,0.4)` |
| `glow-pink` | `rgba(255,107,94,0.4)` | `rgba(255,107,53,0.4)` |
| `glow-gold` | `rgba(255,179,71,0.3)` | `rgba(255,176,0,0.3)` |
| `glow-strong` | `rgba(255,77,141,0.55)` | `rgba(220,20,60,0.55)` |
| `card` | `rgba(9,0,15,0.8)` | `rgba(8,2,5,0.8)` |

### Animation Color Logic
| State | Old | New |
|-------|-----|-----|
| Idle | `#FF4D8D` | `#DC143C` (crimson) |
| Hover | `#FF6B5E` | `#FF6B35` (ember) |
| Active | `#FFB347` | `#FFB000` (gold) |
| Background | `#09000F` | `#080205` (void black) |

## Per-Section Changes

### Hero Background
- Replace cosmic bloom / pink glow with dark reactor chamber
- Layer 1: `#080205` base
- Layer 2: Crimson fog `rgba(220,20,60,0.12)`
- Layer 3: Golden particle sparks

### Crystal Core → Reactor Core
- Outer shell: `#A4161A`
- Inner energy: `#DC143C`
- Hot edges: `#FF6B35`
- Energy highlights: `#FFB000`
- Hue range: 348-48 (deep crimson through gold)
- Feel: digital reactor / quantum engine / power source

### Pixel Logo
- Molten pixel gradient: dark red → crimson → ember → gold (left to right)
- Keep 6-scene choreography but tweak timing for more mechanical/reactor-startup feel
- Tighter intervals, sharper transitions between scenes

### SVG Network Lines (SystemOrbit)
- Default stroke: `#DC143C`
- Active state: `#FFB000`

### Orbit Rings
- Rings: `#FF6B35` (ember)
- Active nodes: `#FFB000` (gold)
- Inactive nodes: `rgba(220,20,60,0.35)`

### Featured Ecosystem (MetroKent)
- Mission Control aesthetic
- Dashboard glow: `rgba(220,20,60,0.25)`
- Phone highlights: `#FF6B35`
- Data points: `#FFB000`

### CTA Section
- Headline: "Let's Build Something Extraordinary."
- Highlight gradient: `90deg, #DC143C → #FF6B35 → #FFB000`

### Footer Terminal
- Cursor: `#FFB000`
- Commands: `#DC143C`
- Terminal glow: `rgba(220,20,60,0.18)`

### Timeline
- Path base: `#DC143C`
- Path gradient: `#DC143C → #FF6B35 → #FFB000`
- Pulse dots: `#FFB000`

### Favicon
- Replace purple lightning bolt with crimson reactor-themed icon

## Files to Modify (18 files)

### Config & Global (2)
1. `tailwind.config.js` — all color tokens, shadows, gradients, keyframes
2. `src/index.css` — CSS variables, body background, glow layers, scrollbar, selection, glass

### Sections (7)
3. `src/components/sections/Hero.tsx` — vignette, inline styles
4. `src/components/sections/FeaturedEcosystem.tsx` — device mock accents
5. `src/components/sections/SystemOrbit.tsx` — SVG stops, connection lines, glow
6. `src/components/sections/Projects.tsx` — any inline accents
7. `src/components/sections/Timeline.tsx` — SVG path gradient, stops
8. `src/components/sections/CtaSection.tsx` — headline gradient, energy orb tint
9. `src/components/sections/Footer.tsx` — terminal cursor, command colors, glow

### Effects (5)
10. `src/components/effects/CrystalCore.tsx` — HSLA hue range, rgba values, core glow
11. `src/components/effects/EnergyOrb.tsx` — HSLA hue range, rgba values
12. `src/components/effects/ParticleField.tsx` — particle color hue range
13. `src/components/effects/OrbitRings.tsx` — SVG stopColors
14. `src/components/effects/PixelLogo.tsx` — pixel color gradient, choreography timing tweaks

### Layout (2)
15. `src/components/layout/Navbar.tsx` — SVG gradient stops, glow
16. `src/components/layout/LoadingScreen.tsx` — particle colors

### UI (3)
17. `src/components/ui/DeviceMock.tsx` — accent colors, glow

### Data (1)
18. `src/data/projects.ts` — hardcoded project card accent hexes

### Assets (2)
19. `public/favicon.svg` — crimson reactor icon
20. `index.html` — meta theme-color

## Implementation Approach

**Layered single-pass migration** in 4 layers:

1. **Config layer**: tailwind.config.js + index.css — re-themes ~60% of site automatically
2. **Inline/SVG layer**: All hardcoded stopColor, rgba, inline style props
3. **Canvas layer**: HSLA hue ranges in all 5 canvas effects + pixelText.ts
4. **Polish layer**: favicon, meta, hero vignette, choreography timing

Each layer is independently verifiable. Zero structural changes.
