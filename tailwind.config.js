/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Indian-inspired color palette
        terracotta: {
          DEFAULT: '#B96C4A',
          deep: '#A05E41',
        },
        indigoRustic: {
          DEFAULT: '#2C3E50',
          deep: '#233240',
        },
        forest: {
          DEFAULT: '#2F5D50',
          deep: '#23463C',
        },
        metal: {
          gold: '#B18A4F',
          bronze: '#8C6239',
          copper: '#B87333',
        },
        charcoal: {
          DEFAULT: '#0F1115',
          soft: '#141821',
        },
        ink: {
          DEFAULT: '#0B0E14',
          light: '#111520',
        },
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
          dark: '#E68A2E',
        },
        peacock: {
          DEFAULT: '#006994',
          light: '#0088B8',
          dark: '#004D6D',
        },
        marigold: {
          DEFAULT: '#F2B705',
          light: '#FFC933',
          dark: '#D9A604',
        },
        ivory: {
          DEFAULT: '#FFF8F0',
          dark: '#F5EFE7',
        },
        earth: {
          green: '#558B6E',
          brown: '#6B4C3B',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lora: ['Lora', 'serif'],
        noto: ['Noto Serif', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        hind: ['Hind', 'sans-serif'],
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper.png')",
        'cloth-texture': "url('/textures/cloth.png')",
        'paisley-pattern': "url('/patterns/paisley.svg')",
        'khadi-texture': "url('/textures/khadi.png')",
        'blockprint-pattern': "url('/patterns/blockprint.svg')",
      },
      boxShadow: {
        'card': '0 6px 18px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 28px rgba(0, 0, 0, 0.12)',
        'gold': '0 2px 10px rgba(198, 161, 91, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

