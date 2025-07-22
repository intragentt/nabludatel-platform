// /admin/src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ошибка входа");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      navigate("/users");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ошибка входа");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="mx-auto w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-10 flex flex-col gap-8 font-sans"
        style={{ minWidth: 320 }}
      >
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-4">
          Вход
        </h2>

        {error && (
          <p className="text-red-600 bg-red-100 rounded-md p-3 text-center text-sm font-medium select-none">
            {error}
          </p>
        )}

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
            required
            autoComplete="username"
          />
        </div>

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
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
