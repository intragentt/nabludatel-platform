import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

console.log("\n" + "=".repeat(60));
console.log("🧠 NABLUДATEL PLATFORM — ADMIN PANEL");
console.log(
  "🛠 Панель администратора для управления проектами, пользователями и контентом."
);
console.log("🖥 Основана на Vite + React + TypeScript.");
console.log("🔧 Подключение к backend через REST API.");
console.log(
  "✨ Часть масштабируемой платформы NABLUДATEL, разрабатываемой @intragentt."
);
console.log("📬 По вопросам и доступу: https://t.me/intragentt");
console.log("=".repeat(60) + "\n");

// ❌ Удалена часть с process.on - она не работает в браузере

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
