// Файл: /apps/kyanchir/src/server.ts

const path = require("path");
const fs = require("fs");
const { printServerStop } = require("../../../scripts/printServerStop.js");
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";

import PageRenderer from "./PageRenderer.js"; // <-- Важно: .js

const app = express();
app.use(express.static("public"));
const PORT = 4000;

app.get("*", (req, res) => {
  try {
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

const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 САЙТ КЛИЕНТА KYANCHIR ЗАПУЩЕН`);
  console.log(`🟢 Локальный адрес:       http://localhost:4000`);
  console.log(`🌐 Домен платформы:       kyanchir.ru`);
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
