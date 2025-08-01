// ============================================================================
// middlewares/authMiddleware.ts - СЛУЖБА БЕЗОПАСНОСТИ БЭКЕНДА
// ============================================================================
// Этот файл содержит "middleware" (промежуточное ПО) - это специальные
// функции-"охранники", которые выполняются ПЕРЕД тем, как запрос
// дойдет до основной логики маршрута.
// ============================================================================

// --- 1. ИМПОРТЫ И НАСТРОЙКИ ---
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ❗️ Ключ для подписи JWT-токенов. Должен быть ТОЧНО ТАКИМ ЖЕ,
//    как и в `routes/auth.ts`. Идеально - вынести в общий конфиг.
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt";

// ============================================================================
// --- УРОВЕНЬ 1: "ОХРАННИК НА ВХОДЕ" (Проверка наличия "пропуска") ---
// ============================================================================
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // 1. Проверяем, есть ли в "кармане" у запроса заголовок `Authorization`.
  const authHeader = req.headers.authorization;
  const clientIp = req.ip || req.connection.remoteAddress || "unknown IP";
  const now = new Date().toISOString();

  // 2. Если заголовка нет - разворачиваем.
  if (!authHeader) {
    console.warn(
      `[AUTH] Unauthorized: No auth header from ${clientIp} on ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({ error: "Unauthorized: no token provided" });
  }

  // 3. Заголовок обычно выглядит так: "Bearer eyJhbGciOiJIUzI1NiIsIn...".
  //    Нас интересует только вторая часть - сам "пропуск" (токен).
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.warn(
      `[AUTH] Unauthorized: Malformed token from ${clientIp} on ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({ error: "Unauthorized: malformed token" });
  }

  // 4. Пытаемся проверить подлинность "пропуска" нашим секретным ключом.
  //    `jwt.verify` автоматически проверяет и подпись, и срок действия.
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };

    // 5. УСПЕХ! "Пропуск" настоящий.
    //    "Прикрепляем к запросу бейджик" с данными пользователя.
    //    Теперь в следующих обработчиках мы сможем получить доступ к `req.user`.
    (req as any).user = payload;

    // 6. Пропускаем запрос дальше, к основной логике.
    next();
  } catch (e) {
    // 7. ПРОВАЛ! "Пропуск" поддельный или просроченный.
    console.warn(
      `[AUTH] Forbidden: Invalid token from ${clientIp} on ${req.method} ${req.originalUrl}`
    );
    return res.status(403).json({ error: "Forbidden: invalid token" });
  }
}

// ============================================================================
// --- УРОВЕНЬ 2: "ОХРАННИКИ НА ЭТАЖАХ" (Проверка уровня доступа) ---
// ============================================================================

/**
 * "Фабрика охранников".
 * Это функция, которая создает и возвращает другую функцию-middleware.
 * @param requiredRole - Роль, которую мы хотим проверять.
 */
export function requireRole(requiredRole: string) {
  // Возвращаем готовую функцию-"охранника".
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Смотрим на "бейджик", который прикрепил `requireAuth`.
    const user = (req as any).user;

    // 2. Если "бейджика" нет или на нем нет "должности" (роли)...
    if (!user || !user.role) {
      return res.status(403).json({ error: "Forbidden: no user role" });
    }

    // 3. Если "должность" на "бейджике" не совпадает с требуемой...
    if (user.role !== requiredRole) {
      return res
        .status(403)
        .json({ error: `Forbidden: requires role ${requiredRole}` });
    }

    // 4. УСПЕХ! Пропускаем дальше.
    next();
  };
}

// Создаем конкретного "охранника" для superadmin.
// Теперь мы можем просто использовать `ensureSuperAdmin` в наших маршрутах.
export const ensureSuperAdmin = requireRole("superadmin");
