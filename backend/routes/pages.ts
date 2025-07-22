import { Router } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";

const router = Router();
const pagesFilePath = resolve(__dirname, "../db/pages.json");

// GET /api/sites/:siteId/pages/:slug - Получить информацию о странице
router.get("/:siteId/pages/:slug", (req, res) => {
  const { siteId, slug } = req.params;

  try {
    const allPages = JSON.parse(readFileSync(pagesFilePath, "utf-8"));
    const page = allPages.find(
      (p: any) => p.siteId === siteId && p.slug === slug
    );

    if (page) {
      res.json(page);
    } else {
      res.status(404).json({ error: "Страница не найдена" });
    }
  } catch (e) {
    res.status(500).json({ error: "Не удалось загрузить страницу" });
  }
});

export default router;
