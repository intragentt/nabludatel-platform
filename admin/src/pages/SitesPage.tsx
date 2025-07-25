// /Users/intragentt/nabludatel.core/admin/src/pages/SitesPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Site {
  id: string;
  name: string;
  domain: string;
  status: "active" | "disabled" | "deleted";
  plan: string;
  createdAt: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Перенаправляем, если нет токена
        return;
      }

      // ИЗМЕНЕНИЕ №1: Добавлен префикс /admin
      const res = await fetch("http://localhost:3001/api/admin/sites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token"); // Недействительный токен или нет прав
        navigate("/login");
        throw new Error("Неавторизован или нет доступа");
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка загрузки сайтов");
      }

      const data = await res.json();
      setSites(data);
    } catch (err) {
      console.error("Ошибка при загрузке сайтов:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (
    siteId: string,
    currentStatus: "active" | "disabled" | "deleted"
  ) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // ИЗМЕНЕНИЕ №2: Добавлен префикс /admin
      const res = await fetch(
        `http://localhost:3001/api/admin/sites/${siteId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        throw new Error("Неавторизован или нет прав на изменение статуса");
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Ошибка изменения статуса сайта");
      }

      // Обновляем статус сайта в локальном состоянии
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.id === siteId ? { ...site, status: newStatus } : site
        )
      );
      // alert(`Статус сайта ${siteId} изменен на ${newStatus}`); // Временное уведомление, можно убрать
    } catch (err) {
      console.error("Ошибка при изменении статуса:", err);
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Произошла неизвестная ошибка");
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Загрузка сайтов...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 text-center">Ошибка: {error}</div>;
  }

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
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleStatus(site.id, site.status)}
                      className={`px-4 py-2 rounded-md text-white font-semibold ${
                        site.status === "active"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {site.status === "active" ? "Отключить" : "Включить"}
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
