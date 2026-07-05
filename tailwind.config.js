/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // SAVANT — Crimson Reactor palette
        bg: '#080205',
        surface: '#120406',
        'surface-2': '#5A0008',
        crimson: {
          900: '#5A0008',
          700: '#A4161A',
          500: '#DC143C',
          400: '#E5383B',
        },
        primary: {
          DEFAULT: '#DC143C',
          600: '#A4161A',
        },
        ember: '#FF6B35',
        gold: '#FFB000',
        text: '#FFF8F3',
        muted: '#C9B8B8',
        glow: {
          crimson: '#DC143C',
          ember: '#FF6B35',
          gold: '#FFB000',
        },
      },
      fontFamily: {
        hero: ['"Pixelify Sans"', 'monospace'],
        display: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        body: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        mono: ['"Archivo Black"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        hero: ['96px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        display: ['64px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        cta: ['72px', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        section: ['32px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      spacing: {
        section: '160px',
      },
      maxWidth: {
        content: '1280px',
        frame: '1440px',
      },
      boxShadow: {
        glow: '0 0 60px rgba(220, 20, 60, 0.4)',
        'glow-strong': '0 0 120px rgba(220, 20, 60, 0.55)',
        'glow-gold': '0 0 60px rgba(255, 176, 0, 0.3)',
        card: '0 30px 80px -20px rgba(8, 2, 5, 0.8)',
      },
      backgroundImage: {
        'crimson-flame':
          'linear-gradient(90deg, #A4161A 0%, #DC143C 35%, #E5383B 65%, #FF6B35 90%, #FFB000 100%)',
        'crimson-soft':
          'linear-gradient(135deg, rgba(220,20,60,0.15) 0%, rgba(255,107,53,0.15) 50%, rgba(255,176,0,0.15) 100%)',
        'radial-fade':
          'radial-gradient(circle at 50% 50%, rgba(220,20,60,0.18), transparent 70%)',
        grid:
          'linear-gradient(rgba(220,20,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,20,60,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '60px 60px',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', filter: 'blur(40px)' },
          '50%': { opacity: '1', filter: 'blur(60px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-draw': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.12)', opacity: '0.8' },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        'spin-slower': 'spin-slow 80s linear infinite reverse',
        shimmer: 'shimmer 3s linear infinite',
        'border-draw': 'border-draw 6s ease infinite',
        pulse: 'pulse 2.4s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
