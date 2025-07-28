/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    ],
    relative: true,
  },
  // гарантируем, что ключевые цвета из UI-пакета всегда попадают в итоговый CSS
  safelist: ['text-brand-lilac'],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "kyanchir-lg": "1025px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          lilac: "#6B80C5",
          "lilac-light": "#C1D0FF",
        },
        accent: {
          pink: "#C1D0FF",
          "pink-light": "#FBC0E3",
          "pink-pale": "#FFE1F3",
        },
        feedback: {
          error: "#E06F6F",
          red: "#D32F2F",
        },
        text: {
          primary: "#272727",
          secondary: "#6B80C5",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#FFE1F3",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
