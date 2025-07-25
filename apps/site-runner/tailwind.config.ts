import type { Config } from "tailwindcss";
import path from "path";

// ====================================================================
// НАЧАЛО "АТОМНОГО ЛОКАТОРА"
// ====================================================================

// Шаг 1: Мы просим Node.js найти главный файл пакета '@nabudatel/ui'.
// require.resolve вернет АБСОЛЮТНЫЙ путь к этому файлу, например:
// '/Users/intragentt/nabludatel.core/packages/ui/dist/index.js'
const uiPackageEntryPoint = require.resolve("@nabudatel/ui");

// Шаг 2: Мы берем путь к этому файлу и "отрезаем" имя файла,
// чтобы получить путь к папке, в которой он лежит (т.е. '/.../ui/dist')
const uiPackageDir = path.dirname(uiPackageEntryPoint);

// Шаг 3: Теперь, зная где находится папка dist, мы строим
// надежный путь к папке с исходниками 'src'
const uiPackageSrcPath = path.join(uiPackageDir, "../src/**/*.{js,ts,jsx,tsx}");

// ====================================================================
// КОНЕЦ "АТОМНОГО ЛОКАТОРА"
// ====================================================================

const config: Config = {
  // Теперь мы даем Tailwind 100% точный и работающий путь
  content: ["./src/**/*.{js,ts,jsx,tsx}", uiPackageSrcPath],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
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
        background: {
          primary: "var(--color-background-primary)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
        },
      },
      fontFamily: {
        body: ["var(--font-manrope)", "sans-serif"],
        heading: ["var(--font-unbounded)", "sans-serif"],
        mono: ["var(--font-pt-mono)", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

export default config;
