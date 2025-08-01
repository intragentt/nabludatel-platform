// ============================================================================
// src/.../ProductCardsEditor.tsx - "СБОРОЧНЫЙ ЦЕХ" ДЛЯ КАРТОЧЕК ТОВАРОВ
// ============================================================================
// Этот компонент - это интерактивный редактор для управления списком
// однотипных элементов (в данном случае, товаров). Он позволяет
// добавлять, удалять и редактировать каждый элемент в списке.
// ============================================================================

// --- 1. ИМПОРТЫ ---
import React, { useEffect, useState } from "react";
import axios from "axios";

// --- 2. ЧЕРТЕЖИ И ТИПЫ ---
interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
}

// ============================================================================
// --- КОМПОНЕНТ ProductCardsEditor ---
// ============================================================================
const ProductCardsEditor: React.FC = () => {
  // --- 3. СОСТОЯНИЕ КОМПОНЕНТА ---
  const [products, setProducts] = useState<Product[]>([]); // "Ячейка памяти" для хранения всего списка товаров.
  const [isSaving, setIsSaving] = useState(false); // Флаг для отслеживания процесса сохранения.

  const token = localStorage.getItem("token"); // ❗️ В будущем это будет получаться из API-клиента.

  // --- 4. ЛОГИКА ---

  // Функция для загрузки списка товаров с сервера.
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/admin/sites/kyanchir/draft/products",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Устанавливаем полученные данные или пустой массив, если данных нет.
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Ошибка при загрузке товаров", err);
    }
  };

  // Загружаем товары один раз при монтировании компонента.
  useEffect(() => {
    fetchProducts();
  }, []);

  // Функция для сохранения ВСЕГО списка товаров в черновик.
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(
        "http://localhost:3001/api/admin/sites/kyanchir/draft/products",
        { products }, // Отправляем на сервер весь массив целиком.
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Черновик товаров сохранён");
    } catch (err) {
      console.error("Ошибка при сохранении", err);
      alert("Ошибка при сохранении");
    } finally {
      setIsSaving(false);
    }
  };

  // Обработчик изменения данных в одном из полей ввода.
  const handleChange = (index: number, field: keyof Product, value: string) => {
    // ❗️ Важнейший паттерн для работы с массивами в React (иммутабельность):
    // 1. Создаем ПОЛНУЮ КОПИЮ текущего массива.
    const updated = [...products];
    // 2. Модифицируем ОДИН элемент в этой КОПИИ.
    updated[index] = { ...updated[index], [field]: value ?? "" };
    // 3. Заменяем старый массив в состоянии на новый, скопированный.
    setProducts(updated);
  };

  // Обработчик для добавления новой, пустой карточки товара.
  const handleAdd = () => {
    setProducts([
      ...products,
      // ❗️ Используем `Date.now()` для создания временного, уникального ID.
      //    Это нужно для React, чтобы он мог правильно отрендерить новый элемент.
      //    В будущем это можно заменить на библиотеку `uuid` для большей надежности.
      { id: Date.now().toString(), title: "", price: "", image: "" },
    ]);
  };

  // Обработчик для удаления карточки товара по ее индексу.
  const handleDelete = (index: number) => {
    // Снова используем паттерн иммутабельности.
    const updated = [...products];
    updated.splice(index, 1); // Удаляем 1 элемент по указанному индексу.
    setProducts(updated);
  };

  // --- 5. ОТРИСОВКА (JSX) ---
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Карточки товаров (черновик)</h2>

      {/* "Пробегаемся" по массиву `products` и для каждого товара рендерим карточку */}
      {products.map((product, index) => (
        <div
          key={product.id || index} // Используем ID или, в крайнем случае, индекс как ключ.
          className="border p-4 rounded shadow bg-gray-50 space-y-2"
        >
          {/* ... (поля ввода для каждого свойства товара) ... */}
          <input
            type="text"
            placeholder="Название"
            value={product.title || ""}
            onChange={(e) => handleChange(index, "title", e.target.value)}
            className="w-full border p-2 rounded"
          />
          {/* ... */}
          <input
            type="text"
            placeholder="Цена"
            value={product.price || ""}
            onChange={(e) => handleChange(index, "price", e.target.value)}
            className="w-full border p-2 rounded"
          />
          {/* ... */}
          <input
            type="text"
            placeholder="URL изображения"
            value={product.image || ""}
            onChange={(e) => handleChange(index, "image", e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-between items-center">
            <img
              src={product.image || "/no-image.png"}
              alt="предпросмотр"
              className="w-40 rounded border"
              // Полезный трюк: если картинка не загрузилась, показываем "заглушку".
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/no-image.png";
              }}
            />
            <button
              onClick={() => handleDelete(index)}
              className="text-red-600"
            >
              ❌ Удалить
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          ➕ Добавить товар
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving} // Блокируем кнопку во время сохранения.
          className={`px-4 py-2 rounded text-white ${
            isSaving ? "bg-gray-400" : "bg-green-600"
          }`}
        >
          💾 {isSaving ? "Сохраняем..." : "Сохранить черновик"}
        </button>
      </div>
    </div>
  );
};

export default ProductCardsEditor;
