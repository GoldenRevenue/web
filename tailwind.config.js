/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#FFFFFF',
        muted: '#A7A7A7',
        muted2: '#7A7A7A',
        surface: '#0D0D0D',
        elevated: '#111111',
        elevated2: '#151515',
        line: 'rgba(255,255,255,0.10)',
        line2: 'rgba(255,255,255,0.16)',
        brand: {
          DEFAULT: '#95BF47',
          light: '#A8E063',
          dark: '#6FAF32',
        },
      },
      maxWidth: {
        content: '1240px',
      },
      borderRadius: {
        xl2: '20px',
        xl3: '28px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 20px 60px -30px rgba(0,0,0,0.9)',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatYSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-3deg)' },
          '50%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.045)' },
        },
        dash: {
          to: { strokeDashoffset: '0' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '10%': { transform: 'translate(-2%,-3%)' },
          '20%': { transform: 'translate(-4%,2%)' },
          '30%': { transform: 'translate(2%,-4%)' },
          '40%': { transform: 'translate(-2%,5%)' },
          '50%': { transform: 'translate(-4%,2%)' },
          '60%': { transform: 'translate(3%,0)' },
          '70%': { transform: 'translate(0,3%)' },
          '80%': { transform: 'translate(-3%,0)' },
          '90%': { transform: 'translate(2%,2%)' },
        },
      },
      animation: {
        float: 'floatY 5s ease-in-out infinite',
        'float-slow': 'floatYSlow 6.5s ease-in-out infinite',
        breathe: 'breathe 4.5s ease-in-out infinite',
        grain: 'grain 8s steps(10) infinite',
      },
    },
  },
  plugins: [],
}
