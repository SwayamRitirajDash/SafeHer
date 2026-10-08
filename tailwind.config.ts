import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#080F1A",
          900: "#132238",
          800: "#1B2F4D",
          700: "#243E63",
          600: "#325482",
        },
        terra: {
          900: "#753B1F",
          800: "#9A502D",
          700: "#C87D55",
          600: "#D98E69",
          500: "#E09B7D",
          400: "#EAB299",
          300: "#F3CBB8",
          200: "#F9E4D8",
          100: "#FDF5F0",
          50: "#FFF9F5",
        },
        ivory: {
          DEFAULT: "#FAF7F2",
          50: "#FCFAF7",
          100: "#FAF7F2",
          200: "#F3EDE2",
          300: "#EAE2D5",
          400: "#D9CFBF",
        },
        sos: {
          DEFAULT: "#FF3B5C",
          hover: "#E62E4E",
          dark: "#B81433",
          light: "#FFE8EC",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
      },
      boxShadow: {
        "swiss-sm": "0 2px 8px rgba(19, 34, 56, 0.04)",
        "swiss": "0 8px 30px rgba(19, 34, 56, 0.06)",
        "swiss-lg": "0 20px 50px rgba(19, 34, 56, 0.1)",
        "swiss-hover": "0 14px 35px rgba(224, 155, 125, 0.18)",
        "sos-pulse": "0 0 0 0 rgba(255, 59, 92, 0.7)",
      },
      borderRadius: {
        "swiss-sm": "10px",
        "swiss": "18px",
        "swiss-lg": "28px",
        "swiss-xl": "36px",
      },
      keyframes: {
        "pulse-sos": {
          "0%": {
            boxShadow: "0 0 0 0 rgba(255, 59, 92, 0.7)",
          },
          "70%": {
            boxShadow: "0 0 0 25px rgba(255, 59, 92, 0)",
          },
          "100%": {
            boxShadow: "0 0 0 0 rgba(255, 59, 92, 0)",
          },
        },
        "wave-pulse": {
          "0%, 100%": { height: "8px" },
          "50%": { height: "32px" },
        },
      },
      animation: {
        "pulse-sos": "pulse-sos 2s infinite",
        "wave-1": "wave-pulse 1s ease-in-out infinite",
        "wave-2": "wave-pulse 1.2s ease-in-out 0.2s infinite",
        "wave-3": "wave-pulse 0.8s ease-in-out 0.4s infinite",
        "wave-4": "wave-pulse 1.1s ease-in-out 0.1s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
