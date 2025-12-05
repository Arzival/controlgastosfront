/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#0a1929',
          secondary: '#132f4c',
          accent: '#1e4976',
          light: '#2a5a8a',
        },
        blue: {
          dark: '#0d1b2a',
          darker: '#0a1628',
          deep: '#1a2332',
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

