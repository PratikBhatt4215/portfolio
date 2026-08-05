/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'translate-x-0',
    'translate-x-full',
    'shadow-2xl',
    'hidden',
    'flex',
    'md:flex',
    'md:hidden',
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#070913',
        cardBg: 'rgba(18, 22, 40, 0.65)',
        cyanNeon: '#00f0ff',
        pinkNeon: '#ff0077',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
