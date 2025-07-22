// Импорт маршрутизатора и маршрутов из React Router
import { Route, Routes, BrowserRouter } from "react-router-dom";

// Общий макет (обёртка) для всех страниц — с навигацией, шапкой и т.д.
import Layout from "./components/Layout";

// Страницы админки
import DashboardPage from "./pages/Dashboard";
import UsersPage from "./pages/Users";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

// Входная точка приложения админки
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} /> {/* Главная */}
          <Route path="/users" element={<UsersPage />} /> {/* Пользователи */}
          <Route path="/settings" element={<SettingsPage />} />{" "}
          {/* Настройки */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
