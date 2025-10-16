/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#cce3ff',
          200: '#99c7ff',
          300: '#66aaff',
          400: '#338eff',
          500: '#0072ff',
          600: '#005bcc',
          700: '#004499',
          800: '#002d66',
          900: '#001733',
        },
        secondary: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e7ff',
          300: '#66dbff',
          400: '#33cfff',
          500: '#00c3ff',
          600: '#009ccc',
          700: '#007599',
          800: '#004e66',
          900: '#002733',
        },
        accent: {
          50: '#fff2e6',
          100: '#ffe6cc',
          200: '#ffcc99',
          300: '#ffb366',
          400: '#ff9933',
          500: '#ff8000',
          600: '#cc6600',
          700: '#994d00',
          800: '#663300',
          900: '#331a00',
        },
         'gdg-blue': {
          50: '#e8f0fe',
          100: '#c6d9fd',
          200: '#a1c0fb',
          300: '#7ba6f9',
          400: '#5e8df8',
          500: '#4285f4', // Google Blue
          600: '#3a75e6',
          700: '#2e62d2',
          800: '#2650b8',
          900: '#1a3c8c',
        },
        'gdg-red': {
          500: '#ea4335', // Google Red
        },
        'gdg-yellow': {
          500: '#fbbc04', // Google Yellow
        },
        'gdg-green': {
          500: '#34a853', // Google Green
        },
        dark: {
          50: '#e6e7f4',
          100: '#cccee9',
          200: '#999dd3',
          300: '#666cbe',
          400: '#333ba8',
          500: '#000a92',
          600: '#000875',
          700: '#000658',
          800: '#00043a',
          900: '#00021d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 15s linear infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
       backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};