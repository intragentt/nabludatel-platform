import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode в папке admin

interface DecodedToken {
  id: string;
  role: "superadmin" | "client" | "admin";
  iat: number;
  exp: number;
}

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (location.pathname !== "/login") {
        navigate("/login"); // Перенаправляем на логин, если токена нет
      }
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUserRole(decoded.role);
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      localStorage.removeItem("token"); // Токен невалиден, удаляем
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  // Если пользователь ещё не залогинен или токен не декодирован, и мы не на странице логина
  if (!userRole && location.pathname !== "/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Загрузка...
      </div>
    );
  }

  // Базовая навигация
  const links = [
    { to: "/", label: "Дашборд" },
    { to: "/users", label: "Пользователи" },
    { to: "/sites", label: "Сайты" },
  ];

  // Настройки доступны только superadmin
  if (userRole === "superadmin") {
    links.push({ to: "/settings", label: "Настройки" });
  }

  return (
    <div className="min-h-screen flex flex-col font-sans w-full">
      <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Admin Panel
        </h1>

        <nav className="space-x-4">
          {links.map(({ to, label }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`px-3 py-1 rounded ${
                location.pathname === to ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token"); // Удаляем токен при выходе
            localStorage.removeItem("role"); // Очищаем старую роль (если была)
            navigate("/login");
          }}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Выйти
        </button>
      </header>

      <main className="flex-grow bg-gray-100 p-6">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        © 2025 nabludatel.core
      </footer>
    </div>
  );
};

export default Layout;
