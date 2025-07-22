// /backend/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const clientIp = req.ip || req.connection.remoteAddress || "unknown IP";
  const now = new Date().toISOString();

  if (!authHeader) {
    console.warn(
      `[${now}] Unauthorized access attempt from ${clientIp} — no Authorization header — ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({ error: "Unauthorized: no token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.warn(
      `[${now}] Unauthorized access attempt from ${clientIp} — malformed token — ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({ error: "Unauthorized: malformed token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };
    (req as any).user = payload; // прокидываем user в req
    next();
  } catch (e) {
    console.warn(
      `[${now}] Unauthorized access attempt from ${clientIp} — invalid token — ${req.method} ${req.originalUrl}`
    );
    return res.status(403).json({ error: "Forbidden: invalid token" });
  }
}

// Middleware для проверки роли (RBAC)
export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.role) {
      return res.status(403).json({ error: "Forbidden: no user role" });
    }
    if (user.role !== requiredRole) {
      return res
        .status(403)
        .json({ error: `Forbidden: requires role ${requiredRole}` });
    }
    next();
  };
}

export const ensureSuperAdmin = requireRole("superadmin");
