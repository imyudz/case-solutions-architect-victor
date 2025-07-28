/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Harry Potter Color Themes
      colors: {
        // Gryffindor
        gryffindor: {
          primary: '#dc3545',
          secondary: '#ffd700',
          dark: '#8b0000',
          light: '#ff6b7a'
        },
        // Slytherin
        slytherin: {
          primary: '#28a745',
          secondary: '#c0c0c0',
          dark: '#0d4016',
          light: '#50c878'
        },
        // Hufflepuff
        hufflepuff: {
          primary: '#ffc107',
          secondary: '#343a40',
          dark: '#b8860b',
          light: '#ffeb3b'
        },
        // Ravenclaw
        ravenclaw: {
          primary: '#007bff',
          secondary: '#cd7f32',
          dark: '#004085',
          light: '#42a5f5'
        },
        // Cores base do tema
        magic: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        // Cores para glassmorphism
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
        }
      },
      
      // Custom Gradients
      backgroundImage: {
        'magic-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gryffindor-gradient': 'linear-gradient(135deg, #dc3545 0%, #ffd700 100%)',
        'slytherin-gradient': 'linear-gradient(135deg, #28a745 0%, #c0c0c0 100%)',
        'hufflepuff-gradient': 'linear-gradient(135deg, #ffc107 0%, #343a40 100%)',
        'ravenclaw-gradient': 'linear-gradient(135deg, #007bff 0%, #cd7f32 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },

      // Custom Shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'magic': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'magical-glow': '0 0 20px rgba(167, 139, 250, 0.3)',
        'house-glow': '0 0 30px rgba(var(--house-color), 0.4)',
      },

      // Custom Animations
      animation: {
        'magical-glow': 'magical-glow 3s ease-in-out infinite alternate',
        'gentle-float': 'gentle-float 3s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'spin-wand': 'spin-wand 2s linear infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },

      keyframes: {
        'magical-glow': {
          '0%': { 
            textShadow: '0 0 5px rgba(167, 139, 250, 0.5)',
            filter: 'drop-shadow(0 0 5px rgba(167, 139, 250, 0.3))'
          },
          '100%': { 
            textShadow: '0 0 20px rgba(167, 139, 250, 0.8)',
            filter: 'drop-shadow(0 0 15px rgba(167, 139, 250, 0.6))'
          },
        },
        'gentle-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'spin-wand': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(90deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(270deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },

      // Typography
      fontFamily: {
        'magical': ['Georgia', 'serif'],
        'system': ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },

      // Custom Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Custom Borders
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
        'magical': '20px',
      },

      // Custom Backdrop Blur
      backdropBlur: {
        'magical': '10px',
      },

      // Custom Z-Index
      zIndex: {
        'modal': '1000',
        'overlay': '999',
        'header': '100',
      },

      // Custom Breakpoints
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    // Glassmorphism Plugin
    function({ addUtilities }) {
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-magical': {
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.hover-lift': {
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        '.hover-lift:hover': {
          transform: 'translateY(-8px)',
        },
      })
    }
  ],
} 