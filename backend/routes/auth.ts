// ============================================================================
// routes/auth.ts - "ПАСПОРТНЫЙ СТОЛ" И "ОТДЕЛ КАДРОВ"
// ============================================================================
// Этот файл определяет маршруты для аутентификации (/login)
// и регистрации (/register) пользователей.
// ============================================================================

// --- 1. ИМПОРТЫ И НАСТРОЙКИ ---
import express from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import jwt from "jsonwebtoken"; // "Мастерская по созданию пропусков"
import bcrypt from "bcryptjs"; // "Шифровальная машина" для паролей

const router = express.Router();
// ❗️ Прямой доступ к файлу. В будущем это будет вынесено в модуль `db/users.ts`.
const filePath = resolve(__dirname, "../db/users.json");

// ❗️ Ключ для подписи JWT-токенов. В продакшене ОБЯЗАТЕЛЬНО должен
//    быть задан через переменную окружения `.env`.
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt";
const JWT_EXPIRES_IN = "2h"; // Срок жизни "пропуска" - 2 часа.

// --- 2. ЗАЩИТА ОТ ПОДБОРА ПАРОЛЕЙ (RATE LIMITING) ---
// Простая, но эффективная система защиты от брутфорс-атак.

const loginAttempts: Record<string, { count: number; last: number }> = {}; // "Журнал попыток входа"
const MAX_ATTEMPTS = 5; // Максимум попыток...
const WINDOW_MS = 10 * 60 * 1000; // ...за 10 минут.

// ============================================================================
// --- МАРШРУТ: POST /api/auth/login ("ВЫДАЧА ПРОПУСКОВ") ---
// ============================================================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress || "unknown IP";
  const now = Date.now();

  // --- Проверка Rate Limiting ---
  if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, last: now };
  if (now - loginAttempts[ip].last > WINDOW_MS) {
    // Если прошло больше 10 минут, сбрасываем счетчик.
    loginAttempts[ip] = { count: 0, last: now };
  }
  loginAttempts[ip].count++;
  loginAttempts[ip].last = now;

  if (loginAttempts[ip].count > MAX_ATTEMPTS) {
    console.warn(`[AUTH] Too many login attempts from ${ip} for ${email}`);
    return res
      .status(429)
      .json({ error: "Слишком много попыток входа. Попробуйте позже." });
  }

  // --- Основная логика входа ---
  // ❗️ В будущем это будет `db.getUserByEmail(email)`.
  const users = JSON.parse(readFileSync(filePath, "utf-8"));
  const user = users.find((u: any) => u.email === email);

  // Сравниваем хэш пароля. `bcrypt.compare` - безопасная функция,
  // она устойчива к "timing attacks".
  const match = user
    ? await bcrypt.compare(password, user.password || "")
    : false;

  if (!user || !match) {
    console.warn(
      `[AUTH] Login failed for ${email} from ${ip} — invalid credentials`
    );
    // ❗️ Важно: мы отправляем ОДИНАКОВУЮ ошибку, чтобы злоумышленник
    //    не мог понять, что именно он ввел неверно: логин или пароль.
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  // --- Создание "пропуска" (JWT) ---
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  console.log(`[AUTH] Login success for ${email} from ${ip}`);
  res.json({ token, role: user.role });
});

// ============================================================================
// --- МАРШРУТ: POST /api/auth/register ("ПРИЕМ НА РАБОТУ") ---
// ============================================================================
// ❗️ В реальном приложении этот маршрут должен быть защищен
//    (например, доступен только для superadmin).
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const ip = req.ip || req.connection.remoteAddress || "unknown IP";

  // --- Валидация входных данных ---
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Некорректный email" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Пароль должен быть не короче 6 символов" });
  }

  // --- Проверка на дубликат ---
  const users = JSON.parse(readFileSync(filePath, "utf-8"));
  if (users.find((u: any) => u.email === email)) {
    return res
      .status(409)
      .json({ error: "Пользователь с таким email уже существует" });
  }

  // --- Создание нового пользователя ---
  const hash = await bcrypt.hash(password, 10); // Хэшируем пароль.
  const newId =
    users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;
  const newUser = { id: newId, name, email, password: hash, role };

  // ❗️ В будущем это будет `db.addUser(newUser)`.
  users.push(newUser);
  writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

  console.log(`[AUTH] Register success for ${email} from ${ip}`);
  // Не возвращаем хэш пароля на клиент!
  res.status(201).json({ id: newId, name, email, role });
});

export default router;
