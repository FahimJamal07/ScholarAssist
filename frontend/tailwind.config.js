/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fa',
          100: '#e7ebf4',
          200: '#cdd5e7',
          300: '#a3b2d2',
          400: '#7289b7',
          500: '#50689b',
          600: '#3e517f',
          700: '#334168',
          800: '#2d3756',
          900: '#293049',
          950: '#1a1d2e',
        },
      },
    },
  },
  plugins: [],
}
