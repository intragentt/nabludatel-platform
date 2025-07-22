import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import {
  ensureSuperAdmin,
  requireAuth,
  ensureSiteAccess,
} from "../middlewares/authMiddleware";

const router = Router();
const sitesFilePath = resolve(__dirname, "../db/sites.json");

// GET /api/sites - Получить список всех сайтов (только для superadmin)
router.get("/", ensureSuperAdmin, (req, res) => {
  try {
    const sites = JSON.parse(readFileSync(sitesFilePath, "utf-8"));
    res.json(sites);
  } catch (e) {
    console.error("Ошибка чтения sites.json:", e);
    res.status(500).json({ error: "Не удалось загрузить сайты" });
  }
});

// PUT /api/sites/:id/status - Обновить статус сайта (только для superadmin)
router.put("/:id/status", ensureSuperAdmin, (req, res) => {
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
        req.user?.id
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

export default router;
