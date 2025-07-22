// /backend/middlewares/auth.ts

import { Request, Response, NextFunction } from "express";

const AUTH_TOKEN = "secret_token_123"; // замените на безопасное значение из .env

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: "Неавторизован" });
  }

  next();
}