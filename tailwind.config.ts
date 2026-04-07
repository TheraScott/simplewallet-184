import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 40px rgba(16, 24, 40, 0.08)',
      },
      backgroundImage: {
        'soft-grid':
          'radial-gradient(circle at top left, rgba(21, 94, 239, 0.10), transparent 26%), radial-gradient(circle at bottom right, rgba(18, 183, 106, 0.10), transparent 30%)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};

export default config;
