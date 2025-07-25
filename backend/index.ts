// /backend/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import usersRouter from "./routes/users";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";
import { publicSitesRouter, adminSitesRouter } from "./routes/sites";
import productsRouter from "./routes/products";
import pagesRouter from "./routes/pages";
import { requireAuth } from "./middlewares/authMiddleware";


const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Разрешаем CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Чтобы парсить JSON
app.use(express.json());

// Раздача статики для загруженных файлов
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ПУБЛИЧНЫЕ МАРШРУТЫ (не требуют JWT)
app.use("/api/auth", authRouter);
app.use("/api/sites", publicSitesRouter); // <-- Для публичной инфы о сайте
app.use("/api/sites", pagesRouter); // <-- Для публичных страниц
app.use("/api/sites", productsRouter); // <-- Для публичных продуктов

// ЗАЩИЩЕННЫЕ МАРШРУТЫ (требуют JWT)
app.use("/api/users", requireAuth, usersRouter);
app.use("/api/upload", requireAuth, uploadRouter);
app.use("/api/admin/sites", requireAuth, adminSitesRouter); // <-- Для админки, с префиксом /admin

// Обработка 404 - неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Неизвестный маршрут" });
});

app.listen(PORT, () => {
  console.clear();
  console.log("\n" + "=".repeat(60));
  console.log(`🧠 NABLUДАТЕЛЬ PLATFORM: BACKEND`);
  console.log(`🌐 Сервер запущен на: http://localhost:${PORT}`);
  console.log(`📂 API доступно по адресу: http://localhost:${PORT}/api`);
  console.log(`📸 Загрузка файлов: http://localhost:${PORT}/api/upload`);
  console.log(`✉️ Telegram: @intragentt`);
  console.log("=".repeat(60) + "\n");
});

process.on("SIGINT", () => {
  console.log("\n" + "=".repeat(60));
  console.log("🛑 Сервер NABLUДATЕЛЬ остановлен вручную.");
  console.log("=".repeat(60) + "\n");
  process.exit(0);
});
