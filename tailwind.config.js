/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#202D43',
          light: '#2A3A55',
          dark: '#161F30',
        },
        white: {
          DEFAULT: '#D9D9D9',
          soft: '#C6C8CC',
        },
        slate: {
          DEFAULT: '#9CA3AF',
          muted: '#6B7280',
        },
        royal: {
          DEFAULT: '#3E71C0',
          light: '#5A8FD4',
          dark: '#2E5A9E',
          glow: 'rgba(62, 113, 192, 0.4)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.24)',
        glow: '0 0 40px rgba(62, 113, 192, 0.15)',
        'glow-lg': '0 0 60px rgba(62, 113, 192, 0.25)',
        lift: '0 20px 40px rgba(0, 0, 0, 0.3)',
        card: '0 4px 24px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':
          'radial-gradient(at 40% 20%, rgba(62, 113, 192, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(62, 113, 192, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(62, 113, 192, 0.08) 0px, transparent 50%)',
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        aurora: 'aurora 15s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        aurora: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
