import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { ensureSuperAdmin } from "../middlewares/authMiddleware";

export const publicSitesRouter = Router(); // <-- Новый публичный роутер
export const adminSitesRouter = Router(); // <-- Старый роутер для админки

const sitesFilePath = resolve(__dirname, "../db/sites.json");

// --- ПУБЛИЧНЫЕ МАРШРУТЫ ---
// GET /api/sites/:id - Получить публичную информацию о сайте
publicSitesRouter.get("/:id", (req, res) => {
  const siteId = req.params.id;
  try {
    const sites = JSON.parse(readFileSync(sitesFilePath, "utf-8"));
    const site = sites.find((s: any) => s.id === siteId);
    if (site) {
      res.json(site);
    } else {
      res.status(404).json({ error: "Сайт не найден" });
    }
  } catch (e) {
    res.status(500).json({ error: "Не удалось загрузить сайт" });
  }
});

// --- МАРШРУТЫ ДЛЯ АДМИНКИ (ЗАЩИЩЕННЫЕ) ---
// GET /api/admin/sites - Получить список всех сайтов
adminSitesRouter.get("/", ensureSuperAdmin, (req, res) => {
  try {
    const sites = JSON.parse(readFileSync(sitesFilePath, "utf-8"));
    res.json(sites);
  } catch (e) {
    res.status(500).json({ error: "Не удалось загрузить сайты" });
  }
});

// PUT /api/admin/sites/:id/status - Обновить статус
adminSitesRouter.put("/:id/status", ensureSuperAdmin, (req, res) => {
  const siteId = req.params.id;
  const { status } = req.body;

  if (
    !siteId ||
    !status ||
    !["active", "disabled", "deleted"].includes(status)
  ) {
    return res.status(400).json({ error: "Некорректный Site ID или статус" });
  }

  try {
    const sites = JSON.parse(readFileSync(sitesFilePath, "utf-8"));
    const siteIndex = sites.findIndex((s: any) => s.id === siteId);

    if (siteIndex === -1) {
      return res.status(404).json({ error: "Сайт не найден" });
    }

    sites[siteIndex].status = status;
    writeFileSync(sitesFilePath, JSON.stringify(sites, null, 2), "utf-8");
    console.log(
      `[${new Date().toISOString()}] Site ${siteId} status updated to ${status} by user ${
        (req as any).user?.id
      }`
    );
    res.json(sites[siteIndex]);
  } catch (e) {
    console.error("Ошибка обновления статуса сайта:", e);
    res
      .status(500)
      .json({ error: "Ошибка сервера при обновлении статуса сайта" });
  }
});
