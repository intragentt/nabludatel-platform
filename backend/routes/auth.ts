// /backend/routes/auth.ts

import express from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();
const filePath = resolve(__dirname, "../db/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt";
const JWT_EXPIRES_IN = "2h";

const loginAttempts: Record<string, { count: number; last: number }> = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 минут

// Логин с rate limiting и логированием
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress || "unknown IP";
  const now = Date.now();
  // Rate limiting
  if (!loginAttempts[ip]) loginAttempts[ip] = { count: 0, last: now };
  if (now - loginAttempts[ip].last > WINDOW_MS) {
    loginAttempts[ip] = { count: 0, last: now };
  }
  loginAttempts[ip].count++;
  loginAttempts[ip].last = now;
  if (loginAttempts[ip].count > MAX_ATTEMPTS) {
    console.warn(
      `[${new Date().toISOString()}] Too many login attempts from ${ip} (${email})`
    );
    return res
      .status(429)
      .json({ error: "Слишком много попыток входа. Попробуйте позже." });
  }
  const users = JSON.parse(readFileSync(filePath, "utf-8"));
  const user = users.find((u: any) => u.email === email);
  if (!user) {
    console.warn(
      `[${new Date().toISOString()}] Login failed for ${email} from ${ip} — user not found`
    );
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const match = await bcrypt.compare(password, user.password || "");
  if (!match) {
    console.warn(
      `[${new Date().toISOString()}] Login failed for ${email} from ${ip} — wrong password`
    );
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  console.log(
    `[${new Date().toISOString()}] Login success for ${email} from ${ip}`
  );
  res.json({ token, role: user.role });
});

// Регистрация (только для примера, в реальном проекте ограничьте доступ)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const ip = req.ip || req.connection.remoteAddress || "unknown IP";
  if (!name || !email || !password || !role) {
    console.warn(
      `[${new Date().toISOString()}] Register failed (missing fields) for ${email} from ${ip}`
    );
    return res.status(400).json({ error: "Все поля обязательны" });
  }
  // Валидация email
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    console.warn(
      `[${new Date().toISOString()}] Register failed (invalid email) for ${email} from ${ip}`
    );
    return res.status(400).json({ error: "Некорректный email" });
  }
  // Валидация пароля
  if (password.length < 6) {
    console.warn(
      `[${new Date().toISOString()}] Register failed (short password) for ${email} from ${ip}`
    );
    return res
      .status(400)
      .json({ error: "Пароль должен быть не короче 6 символов" });
  }
  const users = JSON.parse(readFileSync(filePath, "utf-8"));
  if (users.find((u: any) => u.email === email)) {
    console.warn(
      `[${new Date().toISOString()}] Register failed (duplicate email) for ${email} from ${ip}`
    );
    return res
      .status(409)
      .json({ error: "Пользователь с таким email уже существует" });
  }
  const hash = await bcrypt.hash(password, 10);
  const newId =
    users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1;
  const userWithId = { id: newId, name, email, password: hash, role };
  users.push(userWithId);
  writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
  console.log(
    `[${new Date().toISOString()}] Register success for ${email} from ${ip}`
  );
  res.status(201).json({ id: newId, name, email, role });
});

export default router;
