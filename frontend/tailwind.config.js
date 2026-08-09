/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Legacy colors (kept for backwards compatibility while migrating)
        'velvet-purple': '#5C3975',
        'velvet-purple-dark': '#4a2d5e',
        'velvet-golden': '#CBB26A',
        'velvet-golden-dark': '#b89d5a',
        
        // New tokens
        plum: 'var(--color-plum)',
        gold: 'var(--color-gold)',
        cream: 'var(--color-cream)',
        blush: 'var(--color-blush)',
        charcoal: 'var(--color-charcoal)',
        sage: 'var(--color-sage)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in-slide-up': 'fadeInSlideUp 500ms ease-out',
        'fade-in-slide-down': 'fadeInSlideDown 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-right': 'slideOutRight 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeInSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInSlideDown: {
          '0%': { opacity: '0', transform: 'translateY(-15px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
};
