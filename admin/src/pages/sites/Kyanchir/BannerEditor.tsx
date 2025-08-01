// ============================================================================
// src/pages/sites/Kyanchir/BannerEditor.tsx - РЕДАКТОРСКИЙ ПУЛЬТ ДЛЯ БАННЕРА
// ============================================================================
// Это специализированный компонент, отвечающий за одну задачу:
// редактирование баннера на сайте. Он обладает продвинутой логикой,
// включая автосохранение черновика и ручную публикацию.
// ============================================================================

// --- 1. ИМПОРТЫ ---
import React, { useEffect, useState } from "react";
import axios from "axios"; // Используем axios для более удобных API-запросов.

// --- 2. ЧЕРТЕЖИ И КОНСТАНТЫ ---
type Banner = {
  title: string;
  subtitle: string;
  imageUrl: string;
};

// ❗️ Жестко "зашитый" ID сайта. В будущем это значение должно приходить
//    в компонент извне (через пропсы), чтобы редактор стал переиспользуемым.
const siteId = "kyanchir";

// ============================================================================
// --- КОМПОНЕНТ BannerEditor ---
// ============================================================================
export const BannerEditor: React.FC = () => {
  // --- 3. СОСТОЯНИЕ КОМПОНЕНТА ("ЯЧЕЙКИ ПАМЯТИ") ---

  // Ячейка для хранения черновика, с которым работает пользователь.
  const [draft, setDraft] = useState<Banner>({
    title: "",
    subtitle: "",
    imageUrl: "",
  });
  // Ячейка для хранения последней опубликованной версии (для информации).
  const [published, setPublished] = useState<Banner | null>(null);
  // Ячейка для отслеживания статуса сохранения. Позволяет показывать пользователю, что происходит.
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  // --- 4. ЛОГИКА ---

  // "Датчик", который при первой загрузке компонента запрашивает
  // с сервера и черновик, и опубликованную версию баннера.
  useEffect(() => {
    const fetchBannerData = async () => {
      // ❗️ В будущем эти запросы будут выполняться через центральный API-клиент.
      // ❗️ Здесь также нужна обработка ошибок, как на странице SitesPage.
      const draftRes = await axios.get(
        `/api/sites/${siteId}/banner?preview=true`
      );
      const pubRes = await axios.get(
        `/api/sites/${siteId}/banner?preview=false`
      );
      setDraft(draftRes.data);
      setPublished(pubRes.data);
    };
    fetchBannerData();
  }, []); // Пустой массив `[]` = "сработай один раз".

  // Обработчик изменений в полях ввода.
  const handleChange = (key: keyof Banner, value: string) => {
    // Обновляем черновик новыми данными...
    setDraft((prev) => ({ ...prev, [key]: value }));
    // ... и сразу меняем статус на "сохраняется", чтобы запустить автосейв.
    setSaving("saving");
  };

  // "Умный таймер" для АВТОСОХРАНЕНИЯ (Debounce).
  // Этот "датчик" следит за изменениями в `draft` и `saving`.
  useEffect(() => {
    // Если статус не "сохраняется", ничего не делаем.
    if (saving !== "saving") return;

    // Запускаем таймер. Если за 1.2 секунды пользователь ничего больше
    // не изменит, код внутри таймера выполнится. Если изменит -
    // этот таймер очистится, и запустится новый.
    const timeout = setTimeout(() => {
      const saveDraft = async () => {
        try {
          // ❗️ Опять же, в будущем это будет вызов `api.saveBannerDraft(draft)`.
          await axios.put(`/api/admin/sites/${siteId}/draft/banner`, draft);
          setSaving("saved"); // Статус: "Сохранено!"
        } catch (err) {
          console.error("Ошибка сохранения:", err);
          setSaving("error"); // Статус: "Ошибка!"
        }
      };
      saveDraft();
    }, 1200); // Задержка в 1.2 секунды.

    // Функция очистки: она сработает, если компонент размонтируется
    // или если эффект перезапустится (т.е. пользователь продолжит печатать).
    return () => clearTimeout(timeout);
  }, [draft, saving]); // Зависимости эффекта

  // Функция для ручной публикации.
  const publish = async () => {
    try {
      // ❗️ Вызов для централизации.
      await axios.post(`/api/admin/sites/${siteId}/publish/banner`);
      // Оптимистичное обновление: считаем, что публикация прошла успешно,
      // и обновляем локальное состояние опубликованной версии.
      setPublished(draft);
      alert("Баннер опубликован!");
    } catch (e) {
      alert("Ошибка при публикации");
    }
  };

  // --- 5. ОТРИСОВКА (JSX) ---
  return (
    <div className="p-4 space-y-3">
      <div className="text-sm text-gray-500">
        {/* Индикатор статуса автосохранения */}
        Черновик баннера (автосохраняется, статус: <b>{saving}</b>)
      </div>

      {/* Форма редактирования */}
      <input
        className="w-full border p-2 rounded"
        placeholder="Заголовок"
        value={draft.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Подзаголовок"
        value={draft.subtitle}
        onChange={(e) => handleChange("subtitle", e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="URL картинки"
        value={draft.imageUrl}
        onChange={(e) => handleChange("imageUrl", e.target.value)}
      />

      {/* Кнопка публикации */}
      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={publish}
      >
        🚀 Опубликовать
      </button>

      {/* Информационный блок с опубликованной версией */}
      {published && (
        <div className="text-xs text-gray-500 mt-4">
          <b>Опубликовано:</b> {published.title} / {published.subtitle}
        </div>
      )}
    </div>
  );
};
