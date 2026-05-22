/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', '"Plus Jakarta Sans"', 'Inter', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          deep: 'rgb(var(--color-bg-deep) / <alpha-value>)',
          base: 'rgb(var(--color-bg-base) / <alpha-value>)',
          elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          raised: 'var(--color-surface-raised)',
          glass: 'var(--color-surface-glass)',
        },
        fg: {
          DEFAULT: 'rgb(var(--color-fg) / <alpha-value>)',
          muted: 'rgb(var(--color-fg-muted) / <alpha-value>)',
          subtle: 'rgb(var(--color-fg-subtle) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          caramel: 'rgb(var(--color-accent-caramel) / <alpha-value>)',
          cream: 'rgb(var(--color-accent-cream) / <alpha-value>)',
          espresso: 'rgb(var(--color-accent-espresso) / <alpha-value>)',
          foam: 'rgb(var(--color-accent-foam) / <alpha-value>)',
          glow: 'rgb(var(--color-accent-glow) / <alpha-value>)',
          creamGlow: 'rgb(var(--color-accent-cream-glow) / <alpha-value>)',
        },
        priority: {
          low: 'rgb(var(--color-priority-low) / <alpha-value>)',
          med: 'rgb(var(--color-priority-med) / <alpha-value>)',
          high: 'rgb(var(--color-priority-high) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
      },
      backgroundImage: {
        'gradient-caramel': 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
        'gradient-roast':
          'linear-gradient(135deg, #92400E 0%, #78350F 50%, #451A03 100%)',
        'gradient-cream': 'linear-gradient(135deg, #FAF3E7 0%, #E8D4B7 100%)',
        'gradient-mesh':
          'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(217, 119, 6, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(245, 230, 211, 0.10), transparent 60%), radial-gradient(ellipse 70% 60% at 50% 100%, rgba(180, 83, 9, 0.12), transparent 60%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(245, 230, 211, 0.06), 0 8px 32px rgba(20, 8, 0, 0.5)',
        'glow-accent':
          '0 0 0 1px rgba(217, 119, 6, 0.4), 0 0 32px rgba(217, 119, 6, 0.3)',
        soft: '0 4px 24px rgba(20, 8, 0, 0.4)',
      },
      borderRadius: {
        '4xl': '1.75rem',
      },
      keyframes: {
        'steam-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.5' },
          '33%': { transform: 'translate(30px, -25px) scale(1.1)', opacity: '0.7' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)', opacity: '0.4' },
        },
        'steam-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '33%': { transform: 'translate(-25px, 15px) scale(0.9)', opacity: '0.6' },
          '66%': { transform: 'translate(20px, -25px) scale(1.05)', opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'steam-1': 'steam-1 20s ease-in-out infinite',
        'steam-2': 'steam-2 24s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
      },
    },
  },
  plugins: [],
}
