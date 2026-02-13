import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        throne: {
          black: "#0a0a0f",
          dark: "#12121a",
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
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
      },
      animation: {
        blink: "blink 1s step-start infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
      },
      keyframes: {
        blink: {
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
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
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
