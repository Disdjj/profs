import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  // 启用 JIT 引擎（实现 Tree Shaking）和定义扫描路
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  prefix: '',
  // 定义主题
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
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
        // Neo-Brutalism 颜色扩展
        brutal: {
          base: 'var(--bg-base)',
          panel: 'var(--bg-panel)',
          white: 'var(--bg-white)',
          secondary: 'var(--bg-secondary)',
          pink: 'var(--color-pink)',
          yellow: 'var(--color-yellow)',
          blue: 'var(--color-blue)',
          green: 'var(--color-green)',
          text: {
            primary: 'var(--text-primary)',
            secondary: 'var(--text-secondary)',
          },
          border: {
            primary: 'var(--border-primary)',
            light: 'var(--border-light)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Neo-Brutalism 圆角
        'brutal-xl': '20px',
        'brutal-lg': '16px',
        'brutal-md': '12px',
        'brutal-sm': '10px',
        'brutal-xs': '8px',
      },
      boxShadow: {
        // Neo-Brutalism 硬阴影
        'brutal-sm': '2px 2px 0 rgba(0, 0, 0, 0.15)',
        brutal: '4px 4px 0 rgba(0, 0, 0, 0.15)',
        'brutal-lg': '6px 6px 0 rgba(0, 0, 0, 0.15)',
      },
      borderWidth: {
        // Neo-Brutalism 边框宽度
        brutal: '3px',
        'brutal-2': '2px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
} satisfies Config

export default config
