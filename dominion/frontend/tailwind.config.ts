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
        parchment: "#f4e8c1",
        "parchment-dark": "#e8dcc8",
        "parchment-light": "#faf3e0",
        brown: { border: "#8b6914", dark: "#5a3e1b", text: "#3a2a1a" },
        gold: { DEFAULT: "#c8a832", light: "#e8d06c", dark: "#9a7e1e" },
        forest: "#2d8b4e",
        royal: "#3465a4",
        crimson: "#c03030",
        rpg: { hp: "#22c55e", mp: "#3b82f6", exp: "#c8a832" },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        body: ["system-ui", "sans-serif"],
      },
      boxShadow: {
        rpg: "0 0 0 2px #5a3e1b, 0 0 0 4px #8b6914",
        "rpg-inset": "inset 0 2px 4px rgba(90,62,27,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
