/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f4ee',
        ink: '#0f172a',
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        sand: '#efe8dc',
      },
      boxShadow: {
        panel: '0 30px 60px -28px rgba(15, 23, 42, 0.2)',
        soft: '0 16px 40px -24px rgba(15, 23, 42, 0.16)',
      },
      fontFamily: {
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'dashboard-glow':
          'radial-gradient(circle at top left, rgba(16, 185, 129, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 24%)',
      },
    },
  },
  plugins: [],
}
