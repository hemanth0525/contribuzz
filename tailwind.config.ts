/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "gradient-wave": "wave 3s linear infinite",
        'spin-reverse': 'spin 1s linear infinite reverse',
      },
      colors: {
        "cb-bg": "#0d1117",
        "cb-bg-light": "#161b22",
        "cb-text": "#c9d1d9",
        "cb-text-muted": "#8b949e",
        "cb-primary": "#58a6ff",
        "cb-secondary": "#238636",
        "cb-accent": "#f78166",
        "cb-border": "#30363d",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
        ],
      },
    },
  },
  plugins: [require("daisyui")],
};