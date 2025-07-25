import type { Config } from "tailwindcss";

const config: Config = {
  // Указываем Tailwind, где искать классы для оптимизации CSS
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}", // ВАЖНО: Добавили путь к нашей библиотеке компонентов
  ],
  theme: {
    // Стандартные и понятные брейкпоинты. Mobile-first подход.
    screens: {
      sm: "640px", // Планшеты в портретной ориентации
      md: "768px", // Планшеты в ландшафтной ориентации
      lg: "1024px", // Ноутбуки
      xl: "1280px", // Большие десктопы
      "2xl": "1536px", // Очень большие десктопы
    },
    extend: {
      // Здесь мы ссылаемся на наши CSS-переменные из globals.css
      colors: {
        brand: {
          primary: "var(--color-brand-primary)",
          secondary: "var(--color-brand-secondary)",
          tertiary: "var(--color-brand-tertiary)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          disabled: "var(--color-text-disabled)",
        },
        accent: {
          primary: "var(--color-accent-primary)",
          secondary: "var(--color-accent-secondary)",
          tertiary: "var(--color-accent-tertiary)",
        },
        feedback: {
          error: "var(--color-feedback-error)",
        },
        // Добавим и для фона, чтобы было консистентно
        background: {
          primary: "var(--color-background-primary)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
        },
      },
      fontFamily: {
        // Ссылаемся на переменные, которые будут определены в layout.tsx при подключении шрифтов
        body: ["var(--font-manrope)", "sans-serif"],
        heading: ["var(--font-unbounded)", "sans-serif"],
        mono: ["var(--font-pt-mono)", "monospace"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"), // Этот плагин может быть полезен
  ],
};

export default config;
