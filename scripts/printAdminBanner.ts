import fs from "fs";
import path from "path";

export function printAdminBanner() {
  const pkgPath = path.resolve(__dirname, "../admin/package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
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
  console.log(`🕒 Последнее обновление:  ${pkg.lastUpdated}`);
  console.log(`🧪 Версия билда:          v${pkg.version}`);
  console.log("📬 По вопросам и доступу: https://t.me/intragentt");
  console.log("=".repeat(60) + "\n");
}
