/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0213AF',
        secondary: '#FFFFF1',
        tertiary: '#D3E1FF',
        'vinamilk-blue': '#0213af',
        'vinamilk-blue-light': '#859BDC',
      },
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '70%': { opacity: 0.3 },
          '100%': { opacity: 1 },
        },
        appearFromLeft: {
          '0%': { opacity: 0, transform: 'translate(-20px)' },
          '70%': { opacity: 0.3 },
          '100%': { opacity: 1, transform: 'translate(0)' },
        },
        appearFromRight: {
          '0%': { opacity: 0, transform: 'translate(20px)' },
          '70%': { opacity: 0.3 },
          '100%': { opacity: 1, transform: 'translate(0)' },
        },
      },
      animation: {
        appear: 'appear .75s cubic-bezier(.47,0,.745,.715)',
        'appear-from-left': 'appearFromLeft .75s cubic-bezier(.47,0,.745,.715)',
        'appear-from-right': 'appearFromRight .75s cubic-bezier(.47,0,.745,.715)',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      lora: ['Lora', 'serif'],
      'vsd-bold': ['VNM Sans Display Bold', 'sans-serif'],
      'vsd-regular': ['VNM Sans Display Regular', 'sans-serif'],
      'vs-std': ['VNM Sans Std', 'sans-serif'],
    },
    screens: {
      '2xl': { max: '1535px' },
      // => @media (max-width: 1535px) { ... }
      xl: { max: '1279px' },
      // => @media (max-width: 1535px) { ... }
      lg: { max: '1023px' },
      // => @media (max-width: 1023px) { ... }
      md: { max: '767px' },
      // => @media (max-width: 767px) { ... }
      sm: { max: '639px' },
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [],
};
