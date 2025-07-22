// /backend/routes/users.ts
import { Router } from "express";
import {
  readFileSync,
  writeFileSync,
  openSync,
  fsyncSync,
  closeSync,
} from "fs";
import { resolve } from "path";
import bcrypt from "bcrypt";
import { requireRole } from "../middlewares/authMiddleware";

const router = Router();
const filePath = resolve(__dirname, "../db/users.json");

console.log("[users.ts] Путь к users.json:", filePath);

// Получить всех пользователей (доступно всем авторизованным)
router.get("/", (_req, res) => {
  try {
    const data = readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.status(500).json({ error: "Не удалось загрузить пользователей" });
  }
});

// Добавить пользователя (admin/editor)
router.post("/", requireRole("admin"), async (req, res) => {
  try {
    const newUser = req.body;
    const ip = req.ip || req.connection.remoteAddress || "unknown IP";
    const users = JSON.parse(readFileSync(filePath, "utf-8"));
    // Валидация email
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!newUser.email || !emailRegex.test(newUser.email)) {
      console.warn(
        `[${new Date().toISOString()}] User create failed (invalid email) for ${
          newUser.email
        } from ${ip}`
      );
      return res.status(400).json({ error: "Некорректный email" });
    }
    // Валидация пароля
    if (!newUser.password || newUser.password.length < 6) {
      console.warn(
        `[${new Date().toISOString()}] User create failed (short password) for ${
          newUser.email
        } from ${ip}`
      );
      return res
        .status(400)
        .json({ error: "Пароль должен быть не короче 6 символов" });
    }
    if (users.find((u: any) => u.email === newUser.email)) {
      console.warn(
        `[${new Date().toISOString()}] User create failed (duplicate email) for ${
          newUser.email
        } from ${ip}`
      );
      return res
        .status(409)
        .json({ error: "Пользователь с таким email уже существует" });
    }
    const newId =
      users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;
    let passwordHash = newUser.password;
    if (newUser.password) {
      passwordHash = await bcrypt.hash(newUser.password, 10);
    }
    const userWithId = { id: newId, ...newUser, password: passwordHash };
    users.push(userWithId);
    writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
    console.log(
      `[${new Date().toISOString()}] User created: id=${newId}, email=${
        newUser.email
      }, role=${newUser.role}, by IP=${ip}`
    );
    res.status(201).json(userWithId);
  } catch {
    res.status(400).json({ error: "Невозможно добавить пользователя" });
  }
});

// Удалить пользователя (admin)
router.delete("/:id", requireRole("admin"), (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID" });
  try {
    const users = JSON.parse(readFileSync(filePath, "utf-8"));
    const user = users.find((u: any) => u.id === id);
    const filtered = users.filter((u: any) => u.id !== id);
    writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    console.log(
      `[${new Date().toISOString()}] User deleted: id=${id}, email=${
        user?.email
      }, role=${user?.role}, by IP=${req.ip || req.connection.remoteAddress}`
    );
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Обновить пользователя (admin может менять роль и блокировать, editor только свои данные, viewer запрещено)
router.put("/:id", requireRole("admin"), async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Invalid ID" });
  try {
    const updatedData = req.body;
    const users = JSON.parse(readFileSync(filePath, "utf-8"));
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
    let updatedPassword = users[index].password;
    if (
      updatedData.password &&
      updatedData.password !== users[index].password
    ) {
      updatedPassword = await bcrypt.hash(updatedData.password, 10);
    }
    let merged = { ...users[index], ...updatedData, password: updatedPassword };
    if (
      (req as any).user.role !== "admin" &&
      updatedData.role &&
      updatedData.role !== users[index].role
    ) {
      merged.role = users[index].role; // запрещаем менять роль
    }
    // Логируем блокировку/разблокировку
    if (
      typeof updatedData.isBlocked === "boolean" &&
      updatedData.isBlocked !== users[index].isBlocked
    ) {
      console.log(
        `[${new Date().toISOString()}] User ${
          updatedData.isBlocked ? "blocked" : "unblocked"
        }: id=${id}, email=${merged.email}, by IP=${
          req.ip || req.connection.remoteAddress
        }`
      );
    }
    users[index] = merged;
    try {
      writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
      const after = JSON.parse(readFileSync(filePath, "utf-8"));
      if (after[index].role !== users[index].role) {
        console.error("Ошибка: роль не обновилась в файле!");
      } else {
        console.log("Файл users.json успешно обновлён и проверен");
      }
      console.log(
        `[${new Date().toISOString()}] User updated: id=${id}, email=${
          merged.email
        }, role=${merged.role}, by IP=${req.ip || req.connection.remoteAddress}`
      );
    } catch (e) {
      console.error("Ошибка записи users.json:", e);
      return res.status(500).json({ error: "Ошибка записи users.json" });
    }
    res.json(users[index]);
  } catch (e) {
    console.error("Ошибка при обновлении пользователя:", e);
    res.status(400).json({ error: "Invalid JSON" });
  }
});

export default router;
