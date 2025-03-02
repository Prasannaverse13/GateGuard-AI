/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'gray-950': '#0a0b10',
        'gray-900': '#111318',
        'gray-800': '#1a1c23',
        'gray-700': '#2a2d36',
        'gray-600': '#3b3e4a',
        'blue-900': '#1e3a8a',
        'blue-800': '#1e40af',
        'blue-700': '#1d4ed8',
        'blue-600': '#2563eb',
        'blue-500': '#3b82f6',
      },
      boxShadow: {
        'glow-blue': '0 0 15px -3px rgba(59, 130, 246, 0.4)',
        'glow-purple': '0 0 15px -3px rgba(139, 92, 246, 0.4)',
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};