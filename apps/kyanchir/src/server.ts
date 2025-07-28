// Файл: /apps/kyanchir/src/server.ts

import path from "path";
import fs from "fs";
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";

import PageRenderer from "./PageRenderer.js"; // <-- Важно: .js

const app = express();
app.use(express.static("public"));
const PORT = 4000;

// Путь к файлу с данными сайтов backend
const sitesFilePath = path.resolve(__dirname, "../../backend/db/sites.json");
const SITE_ID = process.env.SITE_ID || "kyanchir-site-id";

function isSiteActive(): boolean {
  try {
    const sites = JSON.parse(fs.readFileSync(sitesFilePath, "utf-8"));
    const site = sites.find((s: any) => s.id === SITE_ID);
    return site?.status === "active";
  } catch (e) {
    console.error("Не удалось прочитать статус сайта:", e);
    return true; // по умолчанию считаем сайт активным
  }
}

app.get("*", (req, res) => {
  try {
    if (!isSiteActive()) {
      return res
        .status(503)
        .send("<h1>Сайт временно отключен администратором</h1>");
    }
    const html = ReactDOMServer.renderToString(
      React.createElement(PageRenderer)
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
  console.log(`🟢 Локальный адрес:       http://localhost:4000`);
  console.log(`🌐 Домен платформы:       kyanchir.ru`);
  console.log("=".repeat(60) + "\n");
});

