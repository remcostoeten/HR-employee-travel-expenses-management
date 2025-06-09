import typography from '@tailwindcss/typography';
import type { Config } from "tailwindcss";
import tailwindAnimate from 'tailwindcss-animate';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    sidebar: {
      DEFAULT: 'hsl(var(--sidebar-background))',
      foreground: 'hsl(var(--sidebar-foreground))',
      primary: 'hsl(var(--sidebar-primary))',
      'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
      accent: 'hsl(var(--sidebar-accent))',
      'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
      border: 'hsl(var(--sidebar-border))',
      ring: 'hsl(var(--sidebar-ring))',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-from-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'slide-out-to-right': {
          '0%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: '0'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'toast-in': {
          '0%': {
            transform: 'translateX(calc(100% + 24px)) scale(0.95)',
            opacity: '0',
            filter: 'blur(8px)'
          },
          '60%': {
            transform: 'translateX(-8px) scale(1.02)',
            opacity: '0.85',
            filter: 'blur(0px)'
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',
            filter: 'blur(0px)'
          }
        },
        'toast-out': {
          '0%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',
            filter: 'blur(0px)'
          },
          '30%': {
            transform: 'translateX(-8px) scale(1.02)',
            opacity: '0.85',
            filter: 'blur(0px)'
          },
          '100%': {
            transform: 'translateX(calc(100% + 24px)) scale(0.95)',
            opacity: '0',
            filter: 'blur(8px)'
          }
        },
        'toast-stack': {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(var(--stack-offset)) scale(var(--stack-scale))' }
        },
        'spinner-blade': {
          '0%': { opacity: '0.85' },
          '50%': { opacity: '0.25' },
          '100%': { opacity: '0.25' },
        },
        'spinner': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-out-to-right': 'slide-out-to-right 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        'toast-in': 'toast-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out': 'toast-out 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-stack': 'toast-stack 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'spinner': 'spinner 1s linear infinite',
        'spinner-blade': 'spinner-blade 1s linear infinite',
      },
      spacing: {
        ...Array.from({ length: 20 }, (_, i) => i * 16).reduce((acc, val) => ({
          ...acc,
          [val]: `${val}px`,
        }), {})
      },
      colors: {
        // Custom color palette
        white: 'var(--white)',
        grey: 'var(--grey)',
        'grey-dull': 'var(--grey-dull)',

        // Design system colors (using CSS variables directly)
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        // Icon colors
        icon: {
          hover: 'var(--icon-hover)',
          regular: 'var(--icon-regular)',
          disabled: 'var(--icon-disabled)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--foreground)',
            hr: {
              borderColor: 'var(--border)',
              marginTop: '2em',
              marginBottom: '2em',
            },
            'h1, h2, h3, h4': {
              color: 'var(--foreground)',
            },
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'var(--primary)',
              },
            },
            strong: {
              color: 'var(--foreground)',
            },
            code: {
              color: 'var(--foreground)',
            },
          },
        },
      },
    },
  },
  plugins: [
    tailwindAnimate,
    typography,
  ],
  // @ts-expect-error - safelist is a valid config option but not typed in Config
  safelist: [
    {
      pattern: /translate-[xy]-[-]?\d+/,
    },
  ],
} satisfies Config;

export default config;
