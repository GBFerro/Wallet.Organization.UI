/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A9B7F",
          light: "#4DB8A1",
          dark: "#147A65",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E8F3F0",
          foreground: "#147A65",
        },
        accent: {
          DEFAULT: "#1F3A5F",
          foreground: "#FFFFFF",
        },
        background: {
          DEFAULT: "#F9FAFB",
          secondary: "#E8F3F0",
          tertiary: "#F3F4F6",
        },
        foreground: {
          DEFAULT: "#3A4A5C",
          secondary: "#6B7280",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        },
        destructive: {
          DEFAULT: "#EF5350",
          foreground: "#F9FAFB",
        },
        chart: {
          1: "#1A9B7F",
          2: "#5A7BA6",
          3: "#F4C430",
          4: "#E57373",
          5: "#9575CD",
        },
        income: {
          DEFAULT: "#1A9B7F",
          light: "#4DB8A1",
        },
        expense: {
          DEFAULT: "#EF5350",
          light: "#F87171",
        },
      },
      fontFamily: {
        display: ["Manrope", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "1rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px -5px rgba(26, 155, 127, 0.3)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        focus: "0 0 0 2px rgba(26, 155, 127, 0.3)",
      },
      backdropBlur: {
        glass: "12px",
        "glass-card": "16px",
      },
    },
  },
  plugins: [],
};
