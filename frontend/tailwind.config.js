/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',
          card: '#0f172a',
          accent: '#0ea5e9', // Cyber blue
          cyan: '#06b6d4',   // Neon cyan
          border: '#1e293b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
