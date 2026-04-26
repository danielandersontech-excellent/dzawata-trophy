import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette dari dokumen
        navy: {
          50: '#EBF0F7',
          100: '#D5E1EE',
          200: '#A6BCD7',
          300: '#7796BF',
          400: '#4870A7',
          500: '#2E548E',
          600: '#1B376D', // Primary brand
          700: '#152C5A',
          800: '#0F2147',
          900: '#091633',
        },
        gold: {
          50: '#FBF4DE',
          100: '#F7E9BD',
          200: '#F2D27E',
          300: '#E8B547',
          400: '#D4A523',
          500: '#C99A06', // Primary gold
          600: '#A88008',
          700: '#8E6B04',
          800: '#5C4502',
          900: '#3A2C01',
        },
        ink: {
          DEFAULT: '#2D2D2D',
          muted: '#555555',
          subtle: '#7A7A7A',
        },
        cream: '#F8F9FA',
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -8px rgba(27, 55, 109, 0.12)',
        'card': '0 2px 12px -4px rgba(27, 55, 109, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 16px 40px -12px rgba(27, 55, 109, 0.18)',
        'gold-glow': '0 0 0 3px rgba(201, 154, 6, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
