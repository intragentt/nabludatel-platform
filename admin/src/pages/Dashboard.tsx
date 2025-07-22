// /admin/src/pages/Dashboard.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Добро пожаловать в админку
      </h1>
      <p>Выберите раздел в меню слева, чтобы начать работу.</p>
    </div>
  );
}
