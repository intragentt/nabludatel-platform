// ============================================================================
// routes/users.ts - "АРХИВ ЛИЧНЫХ ДЕЛ" (CRUD для Пользователей)
// ============================================================================
// Этот файл определяет все маршруты для управления пользователями:
// создание, чтение, обновление и удаление (CRUD).
// ============================================================================

// --- 1. ИМПОРТЫ И НАСТРОЙКИ ---
import { Router } from "express";
import { readFileSync, writeFileSync } from "fs"; // ❗️ Прямая работа с файловой системой.
import { resolve } from "path";
import bcrypt from "bcryptjs";
import { requireRole } from "../middlewares/authMiddleware"; // Импортируем нашего "охранника".

const router = Router();
// ❗️ В будущем этот путь и вся логика работы с файлом будут инкапсулированы
//    в модуле `db/userRepository.ts`.
const filePath = resolve(__dirname, "../db/users.json");

// ============================================================================
// --- МАРШРУТ: GET /api/users (Чтение списка) ---
// ============================================================================
// ❗️ Этот маршрут сейчас не защищен `requireRole`, но защищен `requireAuth`
//    в `index.ts`. Это значит, что ЛЮБОЙ авторизованный пользователь может
//    получить список ВСЕХ пользователей. Это может быть уязвимостью.
router.get("/", (_req, res) => {
  try {
    const data = readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: "Не удалось загрузить пользователей" });
  }
});

// ============================================================================
// --- МАРШРУТ: POST /api/users (Создание) ---
// ============================================================================
// 🔐 Защищено: только для 'admin'.
router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const newUser = req.body;
    const ip = req.ip || req.connection.remoteAddress || "unknown IP";
    const users = JSON.parse(readFileSync(filePath, "utf-8"));

    // --- Валидация Email ---
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!newUser.email || !emailRegex.test(newUser.email)) {
      console.warn(`[USERS] Create failed (invalid email): ${newUser.email} from ${ip}`);
      return res.status(400).json({ error: "Некорректный email" });
    }

    // --- Валидация Пароля ---
    if (!newUser.password || newUser.password.length < 6) {
      console.warn(`[USERS] Create failed (short password): ${newUser.email} from ${ip}`);
      return res.status(400).json({ error: "Пароль должен быть не короче 6 символов" });
    }

    // --- Проверка на дубликат ---
    if (users.find((u: any) => u.email === newUser.email)) {
      console.warn(`[USERS] Create failed (duplicate email): ${newUser.email} from ${ip}`);
      return res.status(409).json({ error: "Пользователь с таким email уже существует" });
    }

    // --- Создание пользователя ---
    const newId = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;
    const passwordHash = await bcrypt.hash(newUser.password, 10);
    const userWithId = { id: newId, ...newUser, password: passwordHash };

    users.push(userWithId);
    writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");

    console.log(`[USERS] User created: id=${newId}, email=${newUser.email}, role=${newUser.role}, by IP=${ip}`);
    res.status(201).json(userWithId);
  } catch {
    res.status(400).json({ error: "Невозможно добавить пользователя" });
  }
});

// ============================================================================
// --- МАРШРУТ: DELETE /api/users/:id (Удаление) ---
// ============================================================================
// 🔐 Защищено: только для 'admin'.
router.delete("/:id", requireRole("admin"), (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID" });
  try {
    const users = JSON.parse(readFileSync(filePath, "utf-8"));
    const filtered = users.filter((u: any) => u.id !== id);
    writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================================================
// --- МАРШРУТ: PUT /api/users/:id (Обновление) ---
// ============================================================================
// ❗️ Это очень сложный и перегруженный маршрут. В будущем его логику
//    лучше разбить на несколько специализированных эндпоинтов.
// 🔐 Защищено: только для 'admin'.
router.put("/:id", requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID" });
  try {
    const updatedData = req.body;
    const users = JSON.parse(readFileSync(filePath, "utf-8"));
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    // --- Логика обновления пароля ---
    // Если в запросе пришел новый пароль, хэшируем его.
    let passwordToSave = users[index].password;
    if (updatedData.password) {
      passwordToSave = await bcrypt.hash(updatedData.password, 10);
    }
    
    // --- Основная логика обновления ---
    // Сливаем старые данные с новыми.
    const mergedUser = { 
      ...users[index], 
      ...updatedData, 
      password: passwordToSave 
    };
    
    users[index] = mergedUser;
    writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
    
    res.json(users[index]);
  } catch (e) {
    console.error("Ошибка при обновлении пользователя:", e);
    res.status(400).json({ error: "Invalid request data" });
  }
});

export default router;