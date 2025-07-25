/** @type {import('tailwindcss').Config} */
import path from "path";

const uiPackageEntryPoint = require.resolve("@nabudatel/ui");
const uiPackageDir = path.dirname(uiPackageEntryPoint);
const uiPackageSrcPath = path.join(uiPackageDir, "../src/**/*.{js,ts,jsx,tsx}");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", uiPackageSrcPath],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
