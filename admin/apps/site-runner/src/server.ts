// apps/site-runner/src/server.ts
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import PageRenderer from "./PageRenderer";

const app = express();
const PORT = 4000;

app.get("/:siteDomain", async (req, res) => {
  const { siteDomain } = req.params;

  try {
    // Пока хардкодим, в будущем будем искать siteId по домену
    if (siteDomain !== "kyanchir.platform.com") {
      return res.status(404).send("Сайт не найден");
    }
    const siteId = "kyanchir-site-id";

    // Загружаем данные с нашего backend API
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

    // Рендерим страницу в HTML-строку
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
  console.log(`🏃 Site Runner запущен на порту ${PORT}`);
});
