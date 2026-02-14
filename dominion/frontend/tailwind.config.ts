import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      colors: {
        throne: {
          black: "#0a0a0f",
          dark: "#10102a",
          purple: "#1a1028",
          deepPurple: "#2d1b4e",
          violet: "#6b21a8",
          gold: "#fbbf24",
          goldDark: "#b8860b",
          goldLight: "#fde68a",
          red: "#dc2626",
          green: "#22c55e",
          blue: "#3b82f6",
          orange: "#f97316",
          cyan: "#06b6d4",
          pink: "#ec4899",
        },
        rpg: {
          border: "#8b7355",
          borderMid: "#5a4a3a",
          borderDark: "#2a1f15",
          panel: "#10102a",
          bg: "#0c0c18",
          parchment: "#1a1510",
          hp: "#22c55e",
          mp: "#3b82f6",
          exp: "#fbbf24",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        body: ['"Courier New"', 'Consolas', 'monospace'],
      },
      animation: {
        blink: "blink 0.8s step-end infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        "chapter-appear": "chapter-appear 1.5s ease-out forwards",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glow: {
          "0%": { textShadow: "0 0 4px #fbbf24, 0 0 8px #fbbf2466" },
          "100%": { textShadow: "0 0 8px #fbbf24, 0 0 20px #fbbf24aa, 0 0 30px #fbbf2444" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "chapter-appear": {
          "0%": { opacity: "0", letterSpacing: "12px" },
          "50%": { opacity: "1", letterSpacing: "6px" },
          "100%": { opacity: "1", letterSpacing: "4px" },
        },
      },
      boxShadow: {
        pixel: "4px 4px 0px 0px #000000",
        "pixel-gold": "4px 4px 0px 0px #b8860b",
        "pixel-inset": "inset 4px 4px 0px 0px rgba(0,0,0,0.3)",
        "glow-gold": "0 0 10px #fbbf2444, 0 0 20px #fbbf2422",
        "glow-purple": "0 0 10px #6b21a844, 0 0 20px #6b21a822",
      },
    },
  },
  plugins: [],
};

export default config;
