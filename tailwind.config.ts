import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#07150d",
          900: "#0d2216",
          800: "#13311f",
          700: "#1a4228",
          600: "#225834",
          500: "#2f7546",
          400: "#4c9f63",
          300: "#8ac49b"
        },
        chalk: "#f5f1e8",
        amberline: "#d8a44c",
        danger: "#da6e4b"
      },
      boxShadow: {
        "pitch-card": "0 24px 80px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        "pitch-grid":
          "linear-gradient(rgba(245,241,232,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
