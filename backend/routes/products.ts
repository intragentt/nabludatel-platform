import { Router } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";

const router = Router();
const productsFilePath = resolve(__dirname, "../db/products.json");

// GET /api/sites/:siteId/products - Получить список продуктов для конкретного сайта
router.get("/:siteId/products", (req, res) => {
  const { siteId } = req.params;

  try {
    const allProducts = JSON.parse(readFileSync(productsFilePath, "utf-8"));
    const siteProducts = allProducts.filter((p: any) => p.siteId === siteId);
    res.json(siteProducts);
  } catch (e) {
    console.error("Ошибка чтения products.json:", e);
    res.status(500).json({ error: "Не удалось загрузить продукты" });
  }
});

export default router;
