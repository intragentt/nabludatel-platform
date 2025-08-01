// ============================================================================
// routes/products.ts - "СОТРУДНИК СПРАВОЧНОЙ" ПО ТОВАРАМ
// ============================================================================
// Этот файл определяет ПУБЛИЧНЫЙ маршрут для получения списка
// продуктов для конкретного сайта.
// ============================================================================

import { Router } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";

const router = Router();
// ❗️ Вся логика работы с файлом должна быть вынесена в репозиторий.
//    Предполагается, что в этом файле лежат товары для ВСЕХ сайтов.
const productsFilePath = resolve(__dirname, "../db/products.json");

// ============================================================================
// --- МАРШРУТ: GET /api/sites/:siteId/products ---
// ============================================================================
router.get("/:siteId/products", (req, res) => {
  const { siteId } = req.params;

  try {
    // 1. Читаем ВЕСЬ файл с товарами.
    const allProducts = JSON.parse(readFileSync(productsFilePath, "utf-8"));

    // 2. Фильтруем его, чтобы найти товары, относящиеся только к запрошенному сайту.
    // ❗️ Это может быть медленно, если товаров очень много.
    const siteProducts = allProducts.filter((p: any) => p.siteId === siteId);

    // 3. Отдаем отфильтрованный список.
    res.json(siteProducts);
  } catch (e) {
    console.error("Ошибка чтения products.json:", e);
    res.status(500).json({ error: "Не удалось загрузить продукты" });
  }
});

export default router;
