
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: '#0A2342',
          foreground: '#FFFFFF',
          primary: '#2C5F8D',
          'primary-foreground': '#FFFFFF',
          accent: '#2C5F8D',
          'accent-foreground': '#FFFFFF',
          border: '#2C5F8D',
          ring: '#D35400'
        },
        'law-blue': {
          DEFAULT: '#0A2342',
          light: '#2CA5DE',
          muted: '#E5F2FC'
        },
        'law-neutral': {
          DEFAULT: '#F5F7FA',
          dark: '#555B6E',
          muted: '#94979E'
        },
        'law-accent': {
          green: '#2D936C',
          amber: '#F3A712',
          red: '#E63946'
        },
        'dharma': {
          DEFAULT: '#0A2342',
          light: '#2C5F8D',
          muted: '#E5F2FC',
          accent: '#D35400',
          dark: '#1B4F72'
        },
        'police': {
          khaki: '#F0E68C',  // Khaki color
          mustard: '#BDB76B', // Darker khaki/mustard
          dark: '#000080',    // Navy blue
          gold: '#D4AF37',    // Badge gold color
          accent: '#F3A712',  // Accent amber color
          light: '#FFFCDF',   // Very light khaki
          border: '#D6C963'   // Border khaki
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
