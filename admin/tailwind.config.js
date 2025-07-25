/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Расширяем палитру цветов, чтобы можно было использовать классы типа bg-brand-primary
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          tertiary: "var(--brand-tertiary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        feedback: {
          error: "var(--error)",
        },
        // ... можно добавить другие группы по аналогии
      },
      // Расширяем семейства шрифтов, чтобы можно было использовать классы типа font-heading
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        heading: ["var(--font-unbounded)", "sans-serif"],
        mono: ["var(--font-pt-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
