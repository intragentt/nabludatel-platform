// /admin/src/pages/Users.tsx
import { useEffect, useState, useRef } from "react";

// Типы пользователя
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
  password?: string; // добавлено поле пароль
}

// Возможные роли
const roles: User["role"][] = ["admin", "editor", "viewer"];

function Avatar({ url, name }: { url?: string; name: string }) {
  const [hasError, setHasError] = useState(false);

  const isValid =
    url && !hasError && /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(url);

  if (!isValid) {
    return (
      <div
        className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl border border-gray-200"
        style={{ width: 40, height: 40 }}
      >
        <span>👤</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      onError={() => setHasError(true)}
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
      style={{ width: 40, height: 40 }}
    />
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("viewer");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<"name" | "email" | "role">("name");
  const [currentRole, setCurrentRole] = useState(
    () => (localStorage.getItem("role") as User["role"]) || "viewer"
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [changePwdUserId, setChangePwdUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdError, setPwdError] = useState("");

  // Храним статус сохранения по каждому пользователю
  const [saveStatus, setSaveStatus] = useState<
    Record<number, "idle" | "saving" | "saved" | "error">
  >({});

  const isDirtyRef = useRef(false); // Флаг несохранённых изменений
  const [uploadingAvatar, setUploadingAvatar] = useState<
    Record<number, boolean>
  >({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem("role", currentRole);
  }, [currentRole]);

  // Предупреждение при попытке покинуть страницу с изменениями
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const markDirty = () => (isDirtyRef.current = true);
  const markClean = () => (isDirtyRef.current = false);

  // Получить список пользователей
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) {
        throw new Error("Ошибка загрузки пользователей: " + res.status);
      }
      const data = await res.json();
      setUsers(data);
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Ошибка загрузки пользователей");
      } else {
        setError("Ошибка загрузки пользователей");
      }
      console.error(err);
    }
  };

  // Загрузка аватара на сервер
  const uploadAvatar = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.url;
  };

  // Добавить нового пользователя
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    let avatarUrl: string | undefined = undefined;
    if (avatarFile) {
      avatarUrl = (await uploadAvatar(avatarFile)) || undefined;
    }

    try {
      const res = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          email,
          role,
          password,
          ...(avatarUrl ? { avatarUrl } : {}),
        }),
      });
      if (!res.ok)
        throw new Error("Ошибка добавления пользователя: " + res.status);
      setName("");
      setEmail("");
      setPassword("");
      setRole("viewer");
      setAvatarFile(null);
      fetchUsers();
      markClean();
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Ошибка добавления пользователя");
      } else {
        setError("Ошибка добавления пользователя");
      }
      console.error(err);
    }
  };

  // Удалить пользователя по ID
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok)
        throw new Error("Ошибка удаления пользователя: " + res.status);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Ошибка удаления пользователя");
      } else {
        setError("Ошибка удаления пользователя");
      }
      console.error(err);
    }
  };

  // Изменение значения в инпуте, автосохранение
  const handleInlineChange = (id: number, key: keyof User, value: string) => {
    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.id === id
          ? { ...u, [key]: key === "role" ? (value as User["role"]) : value }
          : u
      );

      const updatedUser = updated.find((u) => u.id === id);
      if (updatedUser) {
        const payload = {
          ...updatedUser,
          [key]: key === "role" ? (value as User["role"]) : value,
        };
        fetch(`http://localhost:3001/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        })
          .then(async (res) => {
            if (!res.ok) throw new Error();
            markClean();
            setSaveStatus((prev) => ({ ...prev, [id]: "saved" }));
            setError("");
            fetchUsers();
            // Очищаем поле password после успешного изменения
            if (key === "password") {
              setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, password: "" } : u))
              );
            }
          })
          .catch(() => {
            setSaveStatus((prev) => ({ ...prev, [id]: "error" }));
            setError("Ошибка сохранения пользователя");
          });
      }
      return updated;
    });
    markDirty();
  };

  // Загрузка и обновление аватара для пользователя
  const handleAvatarUpdate = async (id: number, file: File) => {
    markDirty();
    setUploadingAvatar((prev) => ({ ...prev, [id]: true }));
    setSaveStatus((prev) => ({ ...prev, [id]: "saving" }));

    try {
      const url = await uploadAvatar(file);
      if (!url) throw new Error();
      const updated = users.find((u) => u.id === id);
      if (!updated) return;

      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...updated, avatarUrl: url }),
      });
      if (!res.ok) throw new Error();

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, avatarUrl: url } : u))
      );
      setSaveStatus((prev) => ({ ...prev, [id]: "saved" }));
      markClean();
      setError("");
    } catch {
      setSaveStatus((prev) => ({ ...prev, [id]: "error" }));
      setError("Ошибка загрузки/обновления аватара");
    } finally {
      setUploadingAvatar((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredUsers = users
    .filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => (a[sort] > b[sort] ? 1 : -1));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <label>Вы вошли как:</label>
        <select
          className="p-2 border border-gray-300"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value as User["role"])}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {currentRole !== "viewer" && (
        <form onSubmit={handleAddUser} className="space-y-2 mb-6">
          <input
            className="w-full p-2 border border-gray-300"
            placeholder="Имя"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              markDirty();
            }}
          />
          <input
            className="w-full p-2 border border-gray-300"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              markDirty();
            }}
          />
          <input
            type="password"
            className="w-full p-2 border border-gray-300"
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              markDirty();
            }}
          />
          <select
            className="w-full p-2 border border-gray-300"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as User["role"]);
              markDirty();
            }}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-300"
            onChange={(e) => {
              setAvatarFile(e.target.files?.[0] || null);
              markDirty();
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            type="submit"
          >
            Добавить
          </button>
        </form>
      )}

      {/* Фильтр и сортировка */}
      <input
        className="w-full p-2 border border-gray-200 mb-4"
        placeholder="Поиск по имени или email"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="mb-2 space-x-2">
        <button onClick={() => setSort("name")}>по имени</button>
        <button onClick={() => setSort("email")}>по email</button>
        <button onClick={() => setSort("role")}>по роли</button>
      </div>

      {/* Список пользователей */}
      <ul className="space-y-4">
        {filteredUsers.map((u) => (
          <li
            key={u.id}
            className="border border-gray-300 p-4 rounded flex flex-col gap-1"
          >
            <div className="flex items-center gap-3 mb-1">
              <Avatar url={u.avatarUrl} name={u.name} />
              <label className="text-xs cursor-pointer flex items-center gap-1">
                <span role="img" aria-label="изменить">
                  📷 изменить
                </span>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  disabled={!!uploadingAvatar[u.id]}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleAvatarUpdate(u.id, file);
                    }
                  }}
                />
                {uploadingAvatar[u.id] && (
                  <span className="text-xs text-blue-400">Загрузка...</span>
                )}
              </label>
              <input
                className="font-bold text-lg border border-transparent focus:border-gray-300 flex-1"
                value={u.name}
                onChange={(e) =>
                  handleInlineChange(u.id, "name", e.target.value)
                }
              />
            </div>
            <input
              className="text-sm text-gray-500 border border-transparent focus:border-gray-300"
              value={u.email}
              onChange={(e) =>
                handleInlineChange(u.id, "email", e.target.value)
              }
            />
            <button
              className="text-xs text-blue-500 underline ml-2"
              onClick={() => {
                setChangePwdUserId(u.id);
                setNewPassword("");
                setConfirmPassword("");
                setPwdError("");
              }}
            >
              Сменить пароль
            </button>
            <select
              className="text-xs uppercase text-gray-400 border border-transparent focus:border-gray-300"
              value={u.role}
              onChange={(e) =>
                handleInlineChange(u.id, "role", e.target.value as User["role"])
              }
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500">
              {saveStatus[u.id] === "saving" && "💾 сохраняем..."}
              {saveStatus[u.id] === "saved" && "✅ сохранено"}
              {saveStatus[u.id] === "error" && "⚠️ ошибка"}
            </div>
            <button
              className="text-red-500 text-xs underline w-fit"
              onClick={() => handleDelete(u.id)}
            >
              удалить
            </button>
          </li>
        ))}
      </ul>

      {/* Модальное окно смены пароля */}
      {changePwdUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-md w-full max-w-xs flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setPwdError("");
              if (newPassword.length < 6) {
                setPwdError("Пароль должен быть не короче 6 символов");
                return;
              }
              if (newPassword !== confirmPassword) {
                setPwdError("Пароли не совпадают");
                return;
              }
              try {
                const res = await fetch(
                  `http://localhost:3001/api/users/${changePwdUserId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ password: newPassword }),
                  }
                );
                if (!res.ok) throw new Error("Ошибка смены пароля");
                setChangePwdUserId(null);
                setNewPassword("");
                setConfirmPassword("");
                setPwdError("");
                fetchUsers();
              } catch {
                setPwdError("Ошибка смены пароля");
              }
            }}
          >
            <div className="font-bold text-lg mb-2">Смена пароля</div>
            <input
              type="password"
              className="p-2 border rounded"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className="p-2 border rounded"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {pwdError && <div className="text-red-500 text-sm">{pwdError}</div>}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Обновить
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={() => setChangePwdUserId(null)}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
