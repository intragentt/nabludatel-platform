// apps/site-runner/src/server.ts
// import "tsconfig-paths/register";
const path = require("path");
const fs = require("fs");
import { printServerStop } from "@scripts/printServerStop";

const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import PageRenderer from "./PageRenderer";

const app = express();
const PORT = 4000;

app.get("/:siteDomain", async (req, res) => {
  const { siteDomain } = req.params;

  try {
    if (siteDomain !== "kyanchir.platform.com") {
      return res.status(404).send("Сайт не найден");
    }
    const siteId = "kyanchir-site-id";

    const [siteRes, pageRes, productsRes] = await Promise.all([
      fetch(`http://localhost:3001/api/sites/${siteId}`),
      fetch(`http://localhost:3001/api/sites/${siteId}/pages/home`),
      fetch(`http://localhost:3001/api/sites/${siteId}/products`),
    ]);

    if (!siteRes.ok || !pageRes.ok || !productsRes.ok) {
      console.error("Ошибка при загрузке данных с бэкенда:", {
        siteStatus: siteRes.status,
        pageStatus: pageRes.status,
        productsStatus: productsRes.status,
      });
      throw new Error("Не удалось загрузить данные с бэкенда");
    }

    const site = await siteRes.json();
    const page = await pageRes.json();
    const products = await productsRes.json();

    const html = ReactDOMServer.renderToString(
      React.createElement(PageRenderer, { page, products, site })
    );

    res.send(`<!DOCTYPE html>${html}`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(`Ошибка рендеринга сайта: ${(error as Error).message}`);
  }
});

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 САЙТ КЛИЕНТА KYANCHIR ЗАПУЩЕН`);
  console.log(`🟢 Локальный адрес:       http://localhost:${PORT}`);
  console.log(`🌐 Домен платформы:       kyanchir.ru`);
  console.log(`📦 Тип:                   SSR / статическая сборка`);
  console.log(`🧩 Рендеринг через:       PageRenderer`);
  console.log(`🕒 Последнее обновление:  ${pkg.lastUpdated}`);
  console.log(`🧪 Версия билда:          v${pkg.version}`);
  console.log(`📬 Обратная связь:        https://t.me/intragentt`);
  console.log(`🧠 Создан на платформе:   NABLUДATEL PLATFORM`);
  console.log("=".repeat(60) + "\n");
});

process.on("SIGINT", () => {
  printServerStop("kyanchir", pkg.lastUpdated, pkg.version);
  process.exit(0);
});
process.on("SIGTERM", () => {
  printServerStop("kyanchir", pkg.lastUpdated, pkg.version);
  process.exit(0);
});
