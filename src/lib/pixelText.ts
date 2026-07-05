export interface SampledPixel {
  x: number;
  y: number;
  hue: number;
}

interface SampleOptions {
  /** Pixel sample step in px (smaller = denser). */
  step?: number;
  /** Max render width. */
  width?: number;
  /** Render height. */
  height?: number;
  /** CSS font shorthand value, e.g. '700 120px "Pixelify Sans", monospace'. */
  font?: string;
  /** Hue at the left edge of the gradient. */
  hueStart?: number;
  /** Hue span across the width (hueStart → hueStart + hueSpan). */
  hueSpan?: number;
  /** Alpha threshold (0-255) above which a pixel is kept. */
  alphaThreshold?: number;
  /** Text alignment: 'center' (default) or 'left'. */
  align?: 'center' | 'left';
}

/**
 * Samples the opaque pixels of a text string rendered onto an offscreen
 * canvas and returns their positions + a hue gradient (crimson → ember → gold by
 * default). Used by both the hero PixelLogo and the LoadingScreen so the
 * "built from pixels" wordmark is identical everywhere.
 *
 * Returns an empty array if 2D context is unavailable (SSR-safe).
 */
export function sampleTextPixels(
  text: string,
  {
    step = 5,
    width = 700,
    height = 160,
    font = '700 120px "Pixelify Sans", monospace',
    hueStart = 348,
    hueSpan = 52,
    alphaThreshold = 128,
    align = 'center',
  }: SampleOptions = {},
): SampledPixel[] {
  if (typeof document === 'undefined') return [];

  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d');
  if (!ctx) return [];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.font = font;

  // Extract original font size from the font string (e.g. "220px" from "220px Jersey 25")
  const sizeMatch = font.match(/^([\d.]+)px/);
  let fontSize = sizeMatch ? parseFloat(sizeMatch[1]) : 120;
  // Strip leading size (and optional weight) to rebuild font at any size
  const family = font.replace(/^[\d.]+px\s*/, '').replace(/^\d+\s+/, '');
  const setFont = (size: number) => {
    ctx.font = `${size}px ${family}`;
  };
  setFont(fontSize);
  const leftPad = align === 'left' ? 20 : 0;
  const maxW = width - leftPad - 10;
  while (ctx.measureText(text).width > maxW && fontSize > 40) {
    fontSize -= 4;
    setFont(fontSize);
  }

  ctx.fillText(text, align === 'left' ? leftPad : width / 2, height / 2);
  const data = ctx.getImageData(0, 0, width, height).data;

  const pixels: SampledPixel[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      if (data[i + 3] > alphaThreshold) {
        pixels.push({ x, y, hue: hueStart + (x / width) * hueSpan });
      }
    }
  }
  return pixels;
}
