// Файл: /apps/kyanchir/src/PageRenderer.tsx

import React from "react";
// Импортируем только Header, больше ничего не нужно для минимальной страницы
import { Header } from "@nabudatel/ui";

export default function PageRenderer() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Клиентский Сайт (Минимум)</title>
        {/* Подключаем стили, чтобы шапка выглядела правильно */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="root">
          <Header />
          {/* Добавляем пустой основной блок, чтобы не было никаких ошибок */}
          <main style={{ padding: "2rem", marginTop: "80px" }}>
            <h1>Клиентский сайт запущен.</h1>
            <p>
              Сейчас отображается только шапка. Все остальные элементы временно
              удалены.
            </p>
          </main>
        </div>
      </body>
    </html>
  );
}
