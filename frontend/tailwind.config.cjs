/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        violet: {
          DEFAULT: '#7c3aed'
        },
        black: {
          DEFAULT: '#0f0f0f'
        }
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(124,58,237,0.15)'
      }
    }
  },
  plugins: []
}



