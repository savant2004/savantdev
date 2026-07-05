# SAVANT — Canvas 2D Effects

## Overview

All particle/visual effects use raw Canvas 2D (no WebGL). Each canvas component manages its own RAF loop, DPR handling, and particle state. The `useCanvas` hook provides a standardised wrapper for most canvases; some complex effects (GalaxyBackground, LoadingScreen ambient, SystemOrbit falling squares) write their own loops.

## Core Canvas Hook

### `useCanvas(draw, deps, options)`

File: `src/hooks/useCanvas.ts`

**Parameters:**
- `draw: (ctx, elapsedMs) => void` — called each frame
- `deps` — dependencies to recreate canvas on change
- `options.clear` — auto `clearRect` each frame (default: `true`)
- `options.pauseOffscreen` — pause RAF when element leaves viewport (default: `true`)

**Features:**
- High-DPI: canvas sized at `Math.min(devicePixelRatio, 2) × boundingRect`
- ResizeObserver for responsive resize
- IntersectionObserver auto-pause when offscreen
- Reduced-motion: draws one static frame and stops
- Cleanup: cancels RAF, disconnects observers on unmount

## Effect Breakdown

### GalaxyBackground

File: `effects/GalaxyBackground.tsx`

3-layer star field with nebula clouds and shooting stars.

**Star layers:**
| Layer | Count Formula | Size | Alpha | Twinkle |
|-------|--------------|------|-------|---------|
| Background | `area / 800` | 0.3–1.1px | 0.04–0.16 | 0.3–1.0 Hz |
| Mid | `area / 4000` | 0.6–2.1px | 0.08–0.28 | 0.5–2.0 Hz |
| Bright | `area / 25000` | 1.5–4.5px | 0.15–0.50 | 0.3–0.9 Hz + radial glow |

**Nebulae:**
- 4–7 clouds, radius 150–500px
- Hue: crimson (350) or ember (10)
- Alpha: 0.015–0.04, pulses at `0.7 + 0.3 × sin(t × 0.15 + hue)`
- Slow drift: `(±0.075, ±0.075)` per frame

**Shooting stars:**
- Spawn every `120 + random(180)` frames
- Speed: 4–10px/frame, angle: -0.6 to -1.4 rad
- Tail: 8–20 segments, fades as it travels
- Life: 40–100 frames, exponential fade-out

**Rendering:**
- Nebulae drawn with `source-over`, stars with `lighter` composite
- Bright stars get radial gradient glow

### PixelLogo

File: `effects/PixelLogo.tsx`

Text sampled into glowing LED pixels via `sampleTextPixels()` from `lib/pixelText.ts`.

**Pixel rendering (`paintLED`):**
5-layer composite:
1. Wide ambient glow: `6.75×` size, 6% alpha
2. Medium bloom: `4.2×` size, 14% alpha
3. Tight glow: `2.25×` size, 35% alpha
4. Inner glow: `1.35×` size, 65% alpha
5. Hot core: `0.75×` size, 85% alpha

**Idle mode:**
- Pixels spring toward target positions (`spring = 0.12, damping = 0.82`)
- Mouse repulsion: pixels within 70px radius pushed away with `force = (1 - dist/70) × 6`
- Click scatter: `scatter = 8`, decays by 0.05/frame
- Breathing: `alpha × (0.85 + 0.15 × sin(t × 0.002 + phase))`

**Loading mode (6 scenes):**
1. Flicker (0–450ms): Random reveal, subtle jitter, high-frequency flicker
2. Swarm (450–950ms): Gentle spring pull + sine wave Y oscillation
3. Wave (950–1450ms): Horizontal lane wave (speed 0.15, lane sine)
4. Assemble (1450–2050ms): Spring tightens from `k=0.04` to `k=0.14`
5. Breathe (2050–2900ms): Identical to idle mode
6. Exit: `handlePixelComplete` fires → fonts ready → overlay fades

**Background field (idle only):**
- 140 background pixels scattered around text bounding box
- 3 depth layers with decreasing alpha
- Rendered as solid squares (no bloom)

### EnergyOrb

File: `effects/EnergyOrb.tsx`

Spiral/vortex animated energy effect for CTA section.

**Implementation details:**
- Spiral particles rotating around center
- `lighter` composite mode for additive glow
- Particles fade in/out at spiral edges

### ParticleField

File: `effects/ParticleField.tsx`

Simple ambient drifting particles (legacy, replaced by GalaxyBackground in Hero).

- Density: `0.00008 × viewport area`
- Particle hue: crimson (350) or ember (10)
- Slow upward drift with horizontal sway
- Rendered as radial gradient circles in `lighter` composite

### CubeCanvas (SystemOrbit)

File: `sections/SystemOrbit.tsx` — `CubeCanvas` component

3D wireframe cube that appears at the convergence point of the orbit.

- 8 vertices rotated on Y axis: `sin(rot), cos(rot)` rotation matrix
- Perspective projection: `scale = 200 / (200 + rz)`
- Appears when progress `> 0.5`, fades in from `p = 0.5 → 1.0`
- Cube size scales with progress: `half = 30 × progress`
- Draws 12 edges with glow (shadowBlur: 15px)
- Shows "SAVANT" text when `p > 0.6`

### Timeline Particle Canvases

File: `sections/Timeline.tsx` — `TimelineParticles` component

Per-milestone 200×200 canvas with 30 drifting particles.

- Particles wrap around edges (toroidal topology)
- Crimson hue, 0.05–0.15 alpha
- Simple `fillRect` rendering (no glow)

### LoadingScreen Ambient

File: `layout/LoadingScreen.tsx`

Full-bleed background canvas with two particle systems:

**Ambient particles:**
- Count: `min(260, area / 6000)`
- Slow upward drift (±0.25 horizontal, -0.05 to -0.23 vertical)
- Flicker via `sin(t × 0.002 + hue)` — 10% alpha variation
- Dual-layer rendering: wide glow (bloom) + small core

**Falling squares:**
- Count: `min(30, area / 50000)`
- Linear downward fall, continuous rotation
- Drawn as stroked squares with 0.5px line width

### SystemOrbit Falling Squares

File: `sections/SystemOrbit.tsx`

Same concept as LoadingScreen but as the section background:
- Count: `min(40, area / 35000)`
- Smaller, slower, more transparent than loading version
- Runs only when section is mounted (no pause)

## DPR Handling

All canvases cap devicePixelRatio at 2× for performance:

```typescript
const dpr = Math.min(window.devicePixelRatio || 1, 2);
canvas.width = Math.floor(width * dpr);
canvas.height = Math.floor(height * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

## Performance Considerations

1. **Offscreen pausing**: `useCanvas` + `IntersectionObserver` stops RAF when not visible
2. **DPR cap**: Never exceed 2x even on retina screens
3. **Particle count**: Density-based on viewport area (fewer particles on small screens)
4. **Composite mode**: `lighter` for additive glow effects, reset to `source-over` after each pass
5. **Reduced motion**: Single static frame, no RAF loop
