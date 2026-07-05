import { cn } from '../../lib/utils';

interface OrbitRingsProps {
  className?: string;
  /** Container size in px (rings scale relative to this). */
  size?: number;
}

/**
 * Three concentric SVG orbit rings that rotate slowly in opposite directions.
 * Rendered as a decorative layer behind/around the CrystalCore and the
 * System Orb. 1px strokes at 20% opacity per the spec.
 */
export function OrbitRings({ className, size = 560 }: OrbitRingsProps) {
  const rings = [
    { r: size * 0.75, dur: '40s', reverse: false, dashed: false },
    { r: size * 0.85, dur: '60s', reverse: true, dashed: true },
    { r: size * 1.0, dur: '80s', reverse: false, dashed: false },
  ];
  const cx = size / 2;
  const box = size;

  return (
    <svg
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      className={cn('pointer-events-none', className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A4161A" />
          <stop offset="30%" stopColor="#DC143C" />
          <stop offset="70%" stopColor="#E5383B" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      {rings.map((ring, i) => (
        <g
          key={i}
          style={{
            transformOrigin: 'center',
            animation: `${ring.reverse ? 'spin-slow' : 'spin-slow'} ${ring.dur} linear infinite${ring.reverse ? ' reverse' : ''}`,
          }}
        >
          <circle
            cx={cx}
            cy={cx}
            r={ring.r / 2}
            stroke="url(#ring-grad)"
            strokeWidth={1}
            strokeOpacity={0.2}
            strokeDasharray={ring.dashed ? '2 8' : undefined}
          />
          {/* A single bright node travelling each ring */}
          <circle
            cx={cx}
            cy={cx - ring.r / 2}
            r={2}
            fill="#FFB000"
            opacity={0.8}
          >
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}
    </svg>
  );
}
