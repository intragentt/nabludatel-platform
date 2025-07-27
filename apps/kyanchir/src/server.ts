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


app.listen(PORT, () => {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 САЙТ КЛИЕНТА KYANCHIR ЗАПУЩЕН`);
  console.log(`🟢 Локальный адрес:       http://localhost:4000`);
  console.log(`🌐 Домен платформы:       kyanchir.ru`);
  console.log("=".repeat(60) + "\n");
});

