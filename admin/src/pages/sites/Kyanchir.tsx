// ============================================================================
// src/pages/sites/Kyanchir.tsx - КОМАНДНЫЙ ЦЕНТР УПРАВЛЕНИЯ САЙТОМ
// ============================================================================
// Эта страница - это "пульт управления" для ОДНОГО конкретного сайта.
// Здесь администратор может редактировать различный контент, который
// будет отображаться на клиентском сайте "Kyanchir".
// ============================================================================

// --- 1. ИМПОРТЫ ---

import React, { useState } from "react";
import ProductCardsEditor from "./Kyanchir/ProductCardsEditor"; // 🔧 Редактор карточек товаров (пока черновик)
import UsersEditor from "./Kyanchir/UsersEditor"; // 🔧 Редактор пользователей (пока заглушка)

// ============================================================================
// --- КОМПОНЕНТ KyanchirSiteAdmin ---
// ============================================================================

const KyanchirSiteAdmin: React.FC = () => {
  // --- 2. СОСТОЯНИЕ КОМПОНЕНТА ("ЯЧЕЙКИ ПАМЯТИ") ---

  // Ячейка для хранения активной вкладки.
  const [tab, setTab] = useState<"content" | "products" | "users">("content");

  // Ячейки для хранения данных формы редактора баннера.
  // ❗️ Заметка: В будущем всю эту логику (состояние + JSX формы) можно
  //    вынести в отдельный, переиспользуемый компонент, например, `BannerEditor.tsx`.
  const [title, setTitle] = useState("Новый баннер");
  const [subtitle, setSubtitle] = useState("Описание баннера");
  const [imageUrl, setImageUrl] = useState("https://placehold.co/800x300");

  // --- 3. ЛОГИКА (ФУНКЦИИ-ОБРАБОТЧИКИ) ---

  // Функция для сохранения черновика баннера.
  const handleSaveDraft = async () => {
    // ❗️ Снова повторяющаяся логика. Идеальный кандидат для выноса
    //    в централизованный "API-клиент".
    const token = localStorage.getItem("token");

    // ❗️ Жестко "зашитый" URL. Это делает компонент негибким.
    //    В будущем это можно будет заменить на динамический ID сайта.
    const res = await fetch(
      "http://localhost:3001/api/admin/sites/kyanchir/draft/banner",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, subtitle, imageUrl }),
      }
    );

    // ❗️ Уведомления через alert() - это простое, но не самое лучшее решение для UX.
    //    В будущем можно будет внедрить систему "тост"-уведомлений.
    if (!res.ok) {
      alert("Ошибка при сохранении черновика");
    } else {
      alert("Черновик баннера сохранён");
    }
  };

  // Функция для открытия клиентского сайта в режиме предпросмотра.
  const handlePreview = () => {
    // ❗️ Еще один жестко "зашитый" URL. Его лучше вынести в переменные окружения (.env).
    window.open("http://localhost:3000?preview=true", "_blank");
  };

  // --- 4. ОСНОВНАЯ ОТРИСОВКА (JSX) ---

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Управление сайтом KYANCHIR</h1>

      {/* Навигация по вкладкам */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setTab("content")}
          className={`px-4 py-2 rounded-t font-semibold ${
            tab === "content"
              ? "bg-white border border-b-0"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Контент
        </button>
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-t font-semibold ${
            tab === "products"
              ? "bg-white border border-b-0"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Товары
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded-t font-semibold ${
            tab === "users"
              ? "bg-white border border-b-0"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Пользователи
        </button>
      </div>

      {/* Условный рендеринг содержимого вкладок */}
      <div className="border rounded p-4 bg-white shadow-md">
        {/* === ВКЛАДКА "КОНТЕНТ" === */}
        {tab === "content" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Баннер (черновик)</h2>

            {/* Поля ввода для управления формой */}
            <input
              type="text"
              placeholder="Заголовок"
              className="w-full border p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Подзаголовок"
              className="w-full border p-2 rounded"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Ссылка на изображение"
              className="w-full border p-2 rounded"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            {/* Предпросмотр изображения */}
            <div className="border rounded overflow-hidden shadow">
              <img
                src={imageUrl}
                alt="Баннер предпросмотр"
                className="w-full"
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 rounded bg-blue-600 text-white"
              >
                💾 Сохранить черновик
              </button>
              <button
                onClick={handlePreview}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                👁 Предпросмотр
              </button>
            </div>
          </div>
        )}

        {/* === ВКЛАДКА "ТОВАРЫ" === */}
        {tab === "products" && <ProductCardsEditor />}

        {/* === ВКЛАДКА "ПОЛЬЗОВАТЕЛИ" === */}
        {tab === "users" && <UsersEditor />}
      </div>
    </div>
  );
};

export default KyanchirSiteAdmin;
