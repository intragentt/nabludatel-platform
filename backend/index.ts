// /backend/index.ts
// Главный файл запуска Express-сервера.
import express from "express";
import cors from "cors";
import path from "path";
import { printServerStop } from "@scripts/printServerStop";
import pkg from "./package.json";
import usersRouter from "./routes/users";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";
import { publicSitesRouter, adminSitesRouter } from "./routes/sites";
import productsRouter from "./routes/products";
import pagesRouter from "./routes/pages";
import { requireAuth } from "./middlewares/authMiddleware";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ✅ Разрешённые домены — укажи реальные в проде
const allowedOrigins = [
  "http://localhost:5173", // админка локально
  "http://localhost:3000", // сайт клиента локально
  "https://admin.nabludatel.com",
  "https://kyanchir.com",
];

// ✅ Гибкий CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Разрешаем только whitelisted домены
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: доступ с ${origin} запрещён`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Чтобы парсить JSON
app.use(express.json());

// Раздача статики для загруженных файлов
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======= Публичные маршруты, не требуют авторизации =======
app.use("/api/auth", authRouter);
app.use("/api/sites", publicSitesRouter); // данные для клиента
app.use("/api/sites", pagesRouter);
app.use("/api/sites", productsRouter);

// ======= Защищённые маршруты — только с валидным токеном =======
app.use("/api/users", requireAuth, usersRouter);
app.use("/api/upload", requireAuth, uploadRouter);
app.use("/api/admin/sites", requireAuth, adminSitesRouter); // всё управление сайтом

// ======= Обработка 404 =======
app.use((req, res) => {
  res.status(404).json({ error: "Неизвестный маршрут" });
});

// ======= Запуск сервера =======
app.listen(PORT, () => {
  console.clear();
  console.log("\n" + "=".repeat(60));
  console.log(`🧠 NABLUДАТЕЛЬ PLATFORM: BACKEND`);
  console.log(`🌐 Сервер запущен на: http://localhost:${PORT}`);
  console.log(`📂 API доступно по адресу: http://localhost:${PORT}/api`);
  console.log(`📸 Загрузка файлов: http://localhost:${PORT}/api/upload`);
  console.log(`🧪 Версия билда:          v${pkg.version}`);
  console.log(`✉️ Telegram: @intragentt`);
  console.log("=".repeat(60) + "\n");
});

// Красиво завершаем работу
process.on("SIGINT", () => {
  printServerStop("backend", null, pkg.version);
  process.exit(0);
});
process.on("SIGTERM", () => {
  printServerStop("backend", null, pkg.version);
  process.exit(0);
});