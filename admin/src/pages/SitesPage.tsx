// ============================================================================
// src/pages/SitesPage.tsx - СТРАНИЦА УПРАВЛЕНИЯ САЙТАМИ
// ============================================================================
// Это "страница-комбайн". Её задачи:
// 1. Загрузить с сервера список всех сайтов и показать их в таблице.
// 2. Дать администратору возможность управлять этими сайтами (менять статус, переходить к настройкам).
// 3. Показать понятные состояния загрузки и ошибок.
// ============================================================================

// --- 1. ИМПОРТЫ ---

import { useEffect, useState } from "react";
// useEffect: "Датчик", который срабатывает при определенных событиях (например, при загрузке страницы).
// useState: Наш инструмент для создания "ячеек памяти" (состояния) внутри компонента.
import { useNavigate } from "react-router-dom"; // "Пульт управления" навигацией.

// --- 2. ЧЕРТЕЖИ И ТИПЫ ---

// Описываем "чертеж" для одного сайта, чтобы TypeScript понимал, какие данные мы ожидаем от сервера.
interface Site {
  id: string;
  name: string;
  domain: string;
  status: "active" | "disabled" | "deleted";
  plan: string;
  createdAt: string;
}

// ============================================================================
// --- КОМПОНЕНТ SitesPage ---
// ============================================================================

export default function SitesPage() {
  // --- 3. СОСТОЯНИЕ КОМПОНЕНТА ("ЯЧЕЙКИ ПАМЯТИ") ---

  const [sites, setSites] = useState<Site[]>([]); // Здесь будет храниться список сайтов.
  const [loading, setLoading] = useState(true); // Флаг, который говорит, идет ли сейчас загрузка.
  const [error, setError] = useState<string | null>(null); // Здесь будет храниться текст ошибки, если что-то пойдет не так.
  const navigate = useNavigate(); // Инициализируем "пульт" навигации.

  // --- 4. ЛОГИКА (ЭФФЕКТЫ И ФУНКЦИИ) ---

  // "Датчик", который срабатывает один раз при первой загрузке страницы.
  // Пустой массив `[]` в конце означает "сработай один раз и больше не трогай".
  useEffect(() => {
    fetchSites(); // Вызываем нашего первого "курьера" за списком сайтов.
  }, []);

  // Функция-курьер №1: Получение списка сайтов
  const fetchSites = async () => {
    console.log("Отправляем курьера за списком сайтов...");
    setLoading(true); // Включаем режим "загрузка...".
    setError(null); // Сбрасываем старые ошибки.

    try {
      // ❗️ Эта логика повторяется. В будущем ее можно вынести в центральный "почтальон".
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Отправляем запрос на сервер.
      const res = await fetch("http://localhost:3001/api/admin/sites", {
        headers: { Authorization: `Bearer ${token}` }, // Прикладываем "пропуск".
      });

      // Если "пропуск" поддельный или уровень доступа не тот...
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Неавторизован или нет доступа");
      }

      // Если любая другая ошибка...
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка загрузки сайтов");
      }

      // Если всё успешно, получаем данные...
      const data = await res.json();
      // ...и кладем их в нашу "ячейку памяти".
      setSites(data);
    } catch (err) {
      console.error("Ошибка при загрузке сайтов:", err);
      // Если что-то пошло не так, записываем ошибку для пользователя.
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      // Этот блок сработает ВСЕГДА, и при успехе, и при ошибке.
      setLoading(false); // Выключаем режим "загрузка...".
    }
  };

  // Функция-курьер №2: Изменение статуса сайта
  const handleToggleStatus = async (
    siteId: string,
    currentStatus: "active" | "disabled" | "deleted"
  ) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    console.log(`Меняем статус сайта ${siteId} на ${newStatus}`);

    try {
      // ❗️ Снова повторяющаяся логика авторизации.
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Отправляем PUT-запрос для изменения данных.
      const res = await fetch(
        `http://localhost:3001/api/admin/sites/${siteId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }), // Отправляем новые данные.
        }
      );

      // Обработка ошибок (тоже повторяется).
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Неавторизован или нет прав на изменение статуса");
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка изменения статуса сайта");
      }

      // ✨ ОПТИМИСТИЧНОЕ ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ✨
      // Вместо того, чтобы заново запрашивать ВЕСЬ список сайтов с сервера,
      // мы обновляем данные "на лету" прямо здесь, в браузере.
      // Это делает интерфейс очень быстрым и отзывчивым.
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId ? { ...site, status: newStatus } : site
        )
      );
    } catch (err) {
      console.error("Ошибка при изменении статуса:", err);
      // Показываем ошибку пользователю.
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Произошла неизвестная ошибка");
      }
    }
  };

  // --- 5. УСЛОВНЫЙ РЕНДЕРИНГ ---
  // В зависимости от состояния, показываем разный интерфейс.

  if (loading) {
    return <div className="p-6 text-center">Загрузка сайтов...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 text-center">Ошибка: {error}</div>;
  }

  // --- 6. ОСНОВНАЯ ОТРИСОВКА (JSX) ---
  // Если загрузка завершена и ошибок нет, показываем таблицу.

  return (
    <div className="container mx-auto max-w-4xl p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Управление Сайтами
      </h1>

      {sites.length === 0 ? (
        <p className="text-gray-600">Сайты не найдены.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* ... (здесь отрисовка таблицы) ... */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Домен
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  План
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sites.map((site) => (
                <tr key={site.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {site.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {site.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        site.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {site.status === "active" ? "Активен" : "Отключен"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* Кнопка вкл/выкл */}
                    <button
                      onClick={() => handleToggleStatus(site.id, site.status)}
                      className={`px-3 py-1 rounded-md text-white text-sm font-semibold ${
                        site.status === "active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {site.status === "active" ? "Отключить" : "Включить"}
                    </button>

                    {/* Кнопка управления */}
                    <button
                      // ❗️ Этот маршрут (`/sites/${site.id}`) пока не существует в App.tsx.
                      // Его нужно будет добавить, чтобы кнопка работала.
                      onClick={() => navigate(`/sites/${site.id}`)}
                      className="px-3 py-1 rounded-md bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900"
                    >
                      Управление
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
