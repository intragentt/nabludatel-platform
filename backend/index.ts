// /backend/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import usersRouter from "./routes/users";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";
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

// Защищённые маршруты с requireAuth
app.use("/api/users", requireAuth, usersRouter);
app.use("/api/upload", requireAuth, uploadRouter);
app.use("/api/auth", authRouter);

// Публичные маршруты (например, для логина/регистрации) можно добавить отдельно без requireAuth
// app.use("/api/auth", authRouter);

// Обработка 404 - неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Неизвестный маршрут" });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend запущен: http://localhost:${PORT}`);
});
