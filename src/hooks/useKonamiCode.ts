import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * Fires `onTrigger` when the Konami code (↑↑↓↓←→←→ B A) is entered.
 * Returns a ref-safe guard so the trigger only fires once per full code.
 */
export function useKonamiCode(onTrigger: () => void) {
  const progress = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const expected = SEQUENCE[progress.current];
      const key = e.key;
      // Allow both lowercase 'b'/'a' and the shifted variants
      if (key.toLowerCase() === expected.toLowerCase()) {
        progress.current += 1;
        if (progress.current === SEQUENCE.length) {
          progress.current = 0;
          onTrigger();
        }
      } else {
        progress.current = key.toLowerCase() === SEQUENCE[0].toLowerCase() ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onTrigger]);
}
