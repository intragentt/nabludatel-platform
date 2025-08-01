// ============================================================================
// src/pages/LoginPage.tsx - "ПРОПУСКНОЙ ПУНКТ" В АДМИН-ПАНЕЛЬ
// ============================================================================
// Эта страница отвечает за аутентификацию пользователя. Она представляет
// собой форму входа, отправляет данные на бэкенд и, в случае успеха,
// сохраняет "пропуск" (токен) и перенаправляет внутрь админки.
// ============================================================================

// --- 1. ИМПОРТЫ ---
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout"; // Импортируем нашу "сцену" для центрирования.

// ============================================================================
// --- КОМПОНЕНТ LoginPage ---
// ============================================================================
export default function LoginPage() {
  // --- 2. СОСТОЯНИЕ КОМПОНЕНТА ("ПАМЯТЬ ФОРМЫ") ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Ячейка для хранения текста ошибки.
  const navigate = useNavigate(); // "Пульт" для перенаправления.

  // --- 3. ЛОГИКА (ОБРАБОТЧИК ОТПРАВКИ ФОРМЫ) ---
  const handleLogin = async (e: React.FormEvent) => {
    // e.preventDefault() - это важнейшая команда. Она отменяет
    // стандартное поведение браузера (перезагрузку страницы) при отправке формы.
    e.preventDefault();

    try {
      // Отправляем "заявление на пропуск" на бэкенд.
      // ❗️ В будущем этот вызов будет выглядеть как `api.auth.login({ email, password })`.
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Если сервер ответил ошибкой (например, "неверный пароль")...
      if (!res.ok) {
        const err = await res.json();
        // ...выбрасываем ошибку с текстом от сервера.
        throw new Error(err.error || "Ошибка входа");
      }

      // Если всё успешно...
      const data = await res.json();
      // ...получаем наш "пропуск" (токен) и кладем его в "карман" браузера (localStorage).
      localStorage.setItem("token", data.token);
      // ...и "телепортируем" пользователя внутрь админки.
      navigate("/users"); // ❗️ Можно изменить на `/` или `/dashboard` в будущем.
    } catch (err: unknown) {
      // "Ловушка" для всех ошибок (и от сервера, и от сети).
      if (err instanceof Error) {
        setError(err.message); // Показываем ошибку пользователю.
      } else {
        setError("Произошла неизвестная ошибка");
      }
    }
  };

  // --- 4. ОТРИСОВКА (JSX) ---
  return (
    // Используем нашу "сцену", чтобы красиво отцентрировать форму.
    <AuthLayout>
      {/* 
        Это сама форма. onSubmit - это событие, которое срабатывает
        при нажатии на кнопку типа "submit" внутри этой формы.
      */}
      <form
        onSubmit={handleLogin}
        className="w-[90%] max-w-md sm:max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-10 flex flex-col gap-8 font-sans"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-4">
          Вход
        </h2>

        {/* Блок для отображения ошибки. Появляется, только если `error` не пустой. */}
        {error && (
          <p className="text-red-600 bg-red-100 rounded-md p-3 text-center text-sm font-medium select-none">
            {error}
          </p>
        )}

        {/* Поле для ввода Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-gray-700 font-medium text-sm select-none"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Поле обязательно для заполнения.
            autoComplete="username" // Подсказка для браузера, чтобы он мог подставить логин.
          />
        </div>

        {/* Поле для ввода пароля */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-gray-700 font-medium text-sm select-none"
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Подсказка для браузера, чтобы он мог подставить пароль.
          />
        </div>

        {/* Кнопка отправки формы */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Войти
        </button>
      </form>
    </AuthLayout>
  );
}
