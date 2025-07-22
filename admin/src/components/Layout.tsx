import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!storedRole && token && location.pathname !== "/login") {
      // Если токен есть, но роли нет — ставим роль по умолчанию (например, admin)
      localStorage.setItem("role", "admin");
      setUserRole("admin");
    } else if (!storedRole && location.pathname !== "/login") {
      navigate("/login");
    } else {
      setUserRole(storedRole);
    }
  }, [navigate, location.pathname]);

  // Если пользователь не залогинен — ничего не показываем (можно добавить спиннер)
  if (!userRole && location.pathname !== "/login") return null;

  // Базовая навигация по ролям
  const links = [
    { to: "/", label: "Дашборд" },
    { to: "/users", label: "Пользователи" },
  ];

  // Настройки доступны только admin
  if (userRole === "admin") {
    links.push({ to: "/settings", label: "Настройки" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
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
              localStorage.removeItem("role");
              navigate("/login");
            }}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="flex-grow bg-gray-100 p-6 w-full max-w-7xl mx-auto">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2025 nabludatel.core
      </footer>
    </div>
  );
};

export default Layout;
