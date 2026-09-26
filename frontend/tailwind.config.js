/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vedic: {
          bg: '#F8FAFC',
          cream: '#FAF6F0',
          surface: '#FFFFFF',
          cardHover: '#F1F5F9',
          border: '#E2E8F0',
          borderAccent: '#FED7AA',
          saffron: '#EA580C',
          saffronDark: '#C2410C',
          saffronLight: '#FB923C',
          marigold: '#F59E0B',
          terracotta: '#9A3412',
          indigo: '#1E3A8A',
          indigoLight: '#3B82F6',
          peacock: '#0284C7',
          darkText: '#0F172A',
          mutedText: '#475569',
          lightText: '#64748B',
          shubh: '#059669',
          ashubh: '#DC2626'
        }
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Cinzel', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'saffron-glow': '0 4px 20px -2px rgba(234, 88, 12, 0.25)',
        'subtle-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'elevated-card': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)'
      }
    },
  },
  plugins: [],
}
