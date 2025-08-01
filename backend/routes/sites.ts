// ============================================================================
// routes/sites.ts - "ДИСПЕТЧЕРСКАЯ ВЫШКА" (Управление Сайтами)
// ============================================================================
// Этот файл - ключевой для управления контентом сайтов. Он грамотно
// разделен на два отдельных "пульта" (роутера):
// 1. `publicSitesRouter`: для публичных запросов (от клиентского сайта).
// 2. `adminSitesRouter`: для защищенных запросов (от нашей админки).
// ============================================================================

import { Router } from "express";
import { readFileSync, writeFileSync, promises as fs } from "fs";
import { resolve, join } from "path";
import { ensureSuperAdmin } from "../middlewares/authMiddleware"; // Наш "охранник" для superadmin.

// --- 1. ИНИЦИАЛИЗАЦИЯ ДВУХ РОУТЕРОВ ---
export const publicSitesRouter = Router();
export const adminSitesRouter = Router();

// ❗️ Вся логика работы с файлом `sites.json` должна быть вынесена в репозиторий.
const sitesFilePath = resolve(__dirname, "../db/sites.json");

// ============================================================================
// --- ЧАСТЬ 1: ПУБЛИЧНЫЕ МАРШРУТЫ (для клиентских сайтов) ---
// ============================================================================
// Эти маршруты не требуют авторизации. Они отдают только опубликованные данные.

// GET /api/sites/:id/banner - Отдает опубликованный баннер (или черновик, если есть `?preview=true`).
publicSitesRouter.get("/:id/banner", (req, res) => {
  const siteId = req.params.id;
  const isPreview = req.query.preview === "true"; // Проверяем флаг предпросмотра.

  try {
    const sites = JSON.parse(readFileSync(sitesFilePath, "utf-8"));
    const site = sites.find((s: any) => s.id === siteId);
    if (!site) return res.status(404).json({ error: "Сайт не найден" });

    // В зависимости от флага, отдаем либо черновик, либо опубликованную версию.
    const banner = isPreview ? site.banner?.draft : site.banner?.published;
    if (!banner) return res.status(404).json({ error: "Баннер не найден" });

    res.json(banner);
  } catch (e) {
    res.status(500).json({ error: "Не удалось получить баннер" });
  }
});

// ============================================================================
// --- ЧАСТЬ 2: АДМИНСКИЕ МАРШРУТЫ (для нашей админки) ---
// ============================================================================
// 🔐 Все маршруты ниже защищены `requireAuth` (в `index.ts`)
//    и `ensureSuperAdmin` (прямо здесь).

// GET /api/admin/sites/ - Получить список ВСЕХ сайтов со ВСЕМИ данными.
adminSitesRouter.get("/", ensureSuperAdmin, (req, res) => {
  // ... (логика чтения файла sites.json) ...
});

// PUT /api/admin/sites/:id/status - Изменить статус сайта (active/disabled).
adminSitesRouter.put("/:id/status", ensureSuperAdmin, (req, res) => {
  // ... (логика валидации, поиска, изменения и сохранения) ...
});

// --- Маршруты для управления баннером ---

// PUT /api/admin/sites/:id/draft/banner - Сохранить черновик баннера.
adminSitesRouter.put("/:id/draft/banner", ensureSuperAdmin, (req, res) => {
  // ... (логика сохранения черновика) ...
});

// POST /api/admin/sites/:id/publish/banner - Опубликовать баннер.
adminSitesRouter.post("/:id/publish/banner", ensureSuperAdmin, (req, res) => {
  // Логика здесь очень грамотная:
  // 1. Находим сайт.
  // 2. Берем данные из `site.banner.draft`.
  // 3. Копируем их в `site.banner.published`.
  // 4. Сохраняем весь файл.
  // ... (остальная логика) ...
});

// --- Маршруты для управления товарами ---
// ❗️ Этот маршрут работает с файловой системой по динамическому пути.
//    Это мощно, но требует особой осторожности для безопасности.
adminSitesRouter.get(
  "/:siteId/draft/products",
  ensureSuperAdmin,
  async (req, res) => {
    const { siteId } = req.params;
    try {
      // В будущем `siteId` нужно будет "санитизировать" (очищать),
      // чтобы предотвратить атаки типа "path traversal" (../../...).
      const filePath = join(__dirname, `../db/${siteId}/products.json`);
      const raw = await fs.readFile(filePath, "utf-8");
      res.json(JSON.parse(raw));
    } catch (err) {
      console.error("Ошибка при получении продуктов:", err);
      res.status(500).json({ error: "Ошибка при получении продуктов" });
    }
  }
);

// ❗️ Здесь не хватает маршрутов для СОХРАНЕНИЯ продуктов.
//    Нужен `PUT /:siteId/draft/products`.
