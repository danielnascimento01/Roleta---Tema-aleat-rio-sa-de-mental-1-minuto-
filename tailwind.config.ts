import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        serena: {
          azul: "#0d2137",
          dourado: "#c49e5a",
          teal: "#1a7a8a",
          azulMedio: "#2e5a7a",
          verde: "#3a6b52",
          terroso: "#8a5a3a",
        },
      },
      fontFamily: {
        title: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-dmsans)", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
