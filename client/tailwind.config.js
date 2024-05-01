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
        'vinamilk-cream': '#F7FFF1',
      },
    },
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
      lora: ['Lora', 'serif'],
      'vsd-bold': ['VNM Sans Display Bold', 'sans-serif'],
      'vsd-regular': ['VNM Sans Display Regular', 'sans-serif'],
      'vs-std': ['VNM Sans Std', 'sans-serif'],
    },
    container: {
      margin: '0 auto',
      width: '100%',
      maxWidth: '1440px',
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
