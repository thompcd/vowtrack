/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom brand colors using CSS variables
        brand: {
          primary: 'rgb(var(--color-primary-500))',
          'primary-hover': 'rgb(var(--color-primary-600))',
          'primary-light': 'rgb(var(--color-primary-100))',
        },
        // Status colors
        status: {
          complete: 'rgb(var(--color-success-500))',
          progress: 'rgb(var(--color-warning-500))',
          broken: 'rgb(var(--color-danger-500))',
          'not-started': 'rgb(var(--color-neutral-500))',
        },
        // Surface colors
        surface: 'rgb(var(--color-surface))',
        page: 'rgb(var(--color-background))',
        // Text colors
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
        'text-muted': 'rgb(var(--color-text-muted))',
      },
    },
  },
  plugins: [],
}