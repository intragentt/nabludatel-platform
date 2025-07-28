# nabludatel.core: Admin + Backend

Модульная система для управления пользователями, ролями и аватарами, построенная на TypeScript, Express и React. Проект ориентирован на простую архитектуру, JSON-хранилища и масштабируемость — с возможностью расширения до полноценной CMS или личного кабинета.

---

## 🎯 Цели проекта

- Простой, читаемый и расширяемый стек (без баз данных, ORM или сложных фреймворков).  
- Локальное хранение данных в JSON-файлах (идеально для MVP, прототипов, дашбордов).  
- Минимальная зависимость от сторонних библиотек.  
- Чёткое разделение клиентской/серверной логики.  

---

## 📁 Структура проекта

```
/nabludatel.core
│
├── backend/                        # Серверная часть на TypeScript + Express
│   ├── index.ts                   # Главная точка входа сервера, инициализирует Express-приложение и маршруты
│   ├── config/                    # Конфигурационные модули для настройки серверных компонентов
│   │   └── multer.ts              # Настройка хранилища Multer для загрузки файлов, определяет путь и правила сохранения
│   ├── db/                       # JSON-файлы в роли базы данных, хранят данные пользователей локально
│   │   └── users.json             # Список пользователей, хранится локально и используется для CRUD операций
│   ├── middlewares/               # Пользовательские middleware Express для обработки запросов
│   │   └── uploadMiddleware.ts   # Middleware для обработки загрузки одного файла через Multer, используется в маршрутах загрузки
│   ├── routes/                   # Маршруты API, реализующие логику обработки запросов
│   │   ├── users.ts              # CRUD-операции над пользователями, обработка GET, POST, PUT, DELETE запросов
│   │   └── upload.ts             # Обработка POST-загрузки изображений, принимает файлы и возвращает URL
│   ├── utils/                    # Вспомогательные утилиты для повторного использования в проекте
│   │   └── paths.ts              # Определение абсолютного пути до папки /uploads, используется в конфигурации Multer и маршрутах
│   ├── uploads/                  # Папка для сохранения загруженных изображений, доступна по URL /uploads/:filename
│   └── tsconfig.json             # Локальная конфигурация TypeScript для backend, задаёт компиляцию серверной части
│
├── admin/                         # Интерфейс администратора (React + Vite)
│   ├── public/                   # Статичные ассеты (иконки, favicon и т.п.), доступны напрямую клиенту
│   ├── src/
│   │   ├── assets/               # Изображения, иконки и статичные медиа для UI
│   │   ├── components/           # Универсальные переиспользуемые React-компоненты
│   │   │   ├── Avatar.tsx        # Компонент отображения аватара пользователя с поддержкой загрузки и отображения
│   │   │   └── UserRow.tsx       # Строка пользователя в таблице с возможностью редактирования и отображения статусов
│   │   ├── hooks/                # Кастомные хуки React для логики компонентов
│   │   │   └── useDebounce.ts    # Хук debounce для автосохранения изменений с задержкой
│   │   ├── lib/                  # API-утилиты и вспомогательные функции для взаимодействия с backend
│   │   │   └── api.ts            # Обёртка над fetch-запросами к backend, обрабатывает ошибки и типизацию
│   │   ├── pages/                # Отдельные страницы приложения, организуют маршрутизацию и логику
│   │   │   └── Users.tsx         # Таблица пользователей и интерфейс редактирования, основная страница админки
│   │   ├── styles/               # Tailwind и глобальные стили для всего приложения
│   │   │   └── index.css         # Импорт Tailwind, шрифтов и прочих глобальных стилей
│   │   ├── App.tsx               # Главный компонент приложения React, содержит роутинг и общие настройки
│   │   └── main.tsx              # Инициализация ReactDOM и рендер приложения в DOM
│   ├── index.html                # HTML-шаблон для Vite, точка входа веб-приложения
│   ├── tailwind.config.js        # Конфигурация TailwindCSS, настраивает дизайн-систему и кастомизации
│   └── vite.config.ts            # Конфигурация сборщика Vite, определяет алиасы, сервер разработки и сборку
│
├── uploads/                      # Alias к backend/uploads для доступа к загруженным файлам
│                                 # Здесь сохраняются изображения, загруженные через API,
│                                 # читаются сервером и доступны клиенту по URL /uploads/:filename
├── tsconfig.json                 # Общая конфигурация TypeScript для всего проекта, задаёт базовые правила компиляции
└── README.md                     # Документация
```

---

## ⚙️ Установка и запуск

### 0. Предварительные требования  
Убедитесь, что глобально установлены `nodemon` и `tsx`:  
```bash
npm install -g nodemon tsx
```
Если они ещё не установлены, это позволит удобно запускать backend с автоматической перезагрузкой и поддержкой TypeScript.

### 1. Установка зависимостей  
```bash
cd nabludatel.core
npm install
cd admin
npm install
```

### 2. Конфигурация TypeScript  
В корне проекта находится общий `tsconfig.json`, который задаёт базовые настройки для TypeScript.  
В папках `backend/` и `admin/` находятся локальные `tsconfig.json` с дополнительными настройками для серверной и клиентской части соответственно.  
Это позволяет разделять конфигурации и оптимизировать сборку.

### 3. Запуск backend (с Nodemon и TSX)  
```bash
cd ../
npx nodemon --watch backend --ext ts,json --exec "ts-node -P tsconfig.json backend/index.ts"
```
По умолчанию backend будет доступен на `http://localhost:3001`. Порт можно изменить переменной окружения `PORT`.

### 4. Запуск frontend (Vite)  
```bash
cd admin
npm run dev
```
Frontend будет доступен на `http://localhost:5173`.

---

## 🧠 API эндпоинты

### Пользователи:  
```
GET    /api/users           # Получить список пользователей
POST   /api/users           # Добавить нового пользователя
PUT    /api/users/:id       # Обновить существующего пользователя
DELETE /api/users/:id       # Удалить пользователя по ID
```

- Заголовки для POST/PUT:  
  ```
  Content-Type: application/json
  Accept: application/json
  ```
- Пример тела запроса POST/PUT:
  ```json
  {
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "role": "admin",
    "avatarUrl": "/uploads/avatar123.png"
  }
  ```
- Пример ответа (успешный GET):
  ```json
  [
    {
      "id": "uuid-1234",
      "name": "Иван Иванов",
      "email": "ivan@example.com",
      "role": "admin",
      "avatarUrl": "/uploads/avatar123.png"
    }
  ]
  ```

### Загрузка файлов:  
```
POST /api/upload            # multipart/form-data, поле: file
```
- Заголовки:  
  ```
  Content-Type: multipart/form-data
  Accept: application/json
  ```
- Пример ответа:  
  ```json
  {
    "url": "http://localhost:3001/uploads/filename.ext"
  }
  ```

---

## ✅ Реализовано

### Backend  
- CRUD-операции над пользователями через JSON — простой и понятный способ хранения данных.  
- Загрузка аватаров с помощью Multer — удобный и безопасный механизм загрузки файлов.  

### Frontend  
- Inline-редактирование в UI — быстрая и интуитивная работа с данными.  
- Хранение текущей роли в localStorage — сохраняет состояние пользователя между сессиями.  

### UX  
- Автосохранение с debounce — уменьшает количество запросов к серверу.  
- Статусы сохранения (🟡 сохраняется, ✅ сохранено, 🔴 ошибка) — информируют пользователя о состоянии.  
- Уведомление при попытке выхода с несохранёнными данными — предотвращает потерю информации.  
- Группировка по ролям (admin/editor/viewer) — удобное отображение и фильтрация пользователей.  
- Загрузка аватаров через drag’n’drop или кнопку — упрощает пользовательский опыт.  

### Инфраструктура  
- Минимальная зависимость от сторонних библиотек — облегчает поддержку и обновление.  
- Чёткое разделение клиентской/серверной логики — упрощает разработку и масштабирование.  

---

## 🛠️ В планах

### Интерфейс
- Реализовать drag-and-drop для добавления пользователей, чтобы ускорить процесс добавления новых записей.
- Добавить модальное окно с подтверждением удаления пользователя для предотвращения случайных удалений.
- Поддержка табов и фильтров для удобной навигации по ролям и статусам пользователей.
- Внедрить возможность массового редактирования и удаления пользователей через UI.
- Добавить предпросмотр аватаров перед загрузкой, чтобы пользователи видели выбранное изображение.
- Реализовать кастомные темы (dark/light/system) с сохранением выбора пользователя.
- Добавить поддержку мультиязычности интерфейса (RU/EN) с возможностью переключения языка на лету.

### API и Backend
- Внедрить JWT-авторизацию для безопасного доступа к API и разграничения прав пользователей.
- Реализовать историю изменений (audit log) для отслеживания всех правок пользователей и ролей.
- Добавить версионирование файла users.json для предотвращения потери данных и отката к предыдущим версиям.
- Внедрить WebSocket или SSE для обновления данных в реальном времени на клиенте.
- Создать Telegram-бота для уведомлений о важных изменениях и логировании действий администраторов.
- Добавить поддержку пагинации и сортировки на стороне сервера для оптимизации работы с большими объёмами данных.
- Реализовать API для экспорта и импорта пользователей в форматах CSV и JSON.

### Безопасность
- Внедрить защиту от CSRF и XSS атак на уровне API и frontend.
- Настроить ограничение скорости запросов (rate limiting) для предотвращения DDoS атак.
- Реализовать многофакторную аутентификацию (2FA) для администраторов.
- Шифровать чувствительные данные и пароли пользователей в базе данных.
- Добавить аудит безопасности и тестирование уязвимостей.
- Настроить безопасное хранение и ротацию API-ключей в настройках.
- Внедрить систему ролей с детализированными правами доступа и разграничением функционала.

### Инфраструктура и DevOps
- Создать страницу настроек с управлением API-ключами и конфигурацией сервиса.
- Интегрировать CI/CD для автоматического тестирования и деплоя приложения.
- Настроить централизованное логирование и мониторинг через PM2, Sentry или аналогичные инструменты.
- Автоматизировать создание и обновление Docker-контейнеров для упрощения развертывания.
- Внедрить систему бэкапов данных с возможностью автоматического восстановления.
- Настроить уведомления в Slack или Email при критических ошибках и важных событиях.
- Организовать масштабируемую инфраструктуру с балансировкой нагрузки и отказоустойчивостью.

### Производительность
- Оптимизировать загрузку и обработку изображений, включая ресайзинг и сжатие на сервере.
- Внедрить кэширование API-запросов на стороне клиента и сервера.
- Использовать ленивую загрузку компонентов и данных в frontend для ускорения начальной загрузки.
- Оптимизировать работу с JSON-файлами, минимизируя блокировки и ускоряя операции чтения/записи.
- Добавить метрики производительности и профилирование для выявления узких мест.
- Реализовать CDN для отдачи статики и загруженных файлов.
- Внедрить предварительную генерацию и оптимизацию статики для frontend.

### Пользовательский опыт
- Добавить индикацию прогресса загрузки больших файлов и операций сохранения.
- Реализовать уведомления и подсказки при ошибках и успешных действиях.
- Внедрить предупреждения при попытке покинуть страницу с несохранёнными изменениями.
- Добавить поддержку drag-and-drop для загрузки аватаров и файлов.
- Реализовать сохранение состояния фильтров и сортировок между сессиями.
- Добавить возможность персонализации интерфейса (настройка колонок, сортировки).
- Внедрить адаптивный дизайн для мобильных устройств и планшетов.

### Масштабирование
- Перейти от JSON-файлов к полноценной базе данных (например, SQLite или PostgreSQL) при росте проекта.
- Реализовать микросервисную архитектуру для отдельных модулей (авторизация, загрузка файлов и т.д.).
- Добавить поддержку нескольких языков и региональных настроек.
- Внедрить распределённое хранение файлов и данных для повышения отказоустойчивости.
- Настроить горизонтальное масштабирование backend с балансировкой нагрузки.
- Добавить поддержку мульти-организаций и разграничения данных.
- Реализовать API Gateway и систему управления версиями API.

### Интеграции
- Интегрировать с внешними сервисами аутентификации (OAuth, LDAP).
- Добавить возможность экспорта и импорта данных через сторонние сервисы.
- Внедрить интеграцию с системами оповещений (Slack, Email, Telegram).
- Реализовать вебхуки для уведомления внешних систем о событиях.
- Добавить поддержку аналитики и сбора статистики использования.
- Интегрировать с системами мониторинга и алертинга.
- Внедрить API для мобильных приложений и сторонних клиентов.

### Тестирование и качество
- Автоматизировать тестирование API с использованием Jest, Supertest или аналогов.
- Реализовать end-to-end тесты для frontend с Cypress или Playwright.
- Внедрить линтинг и статический анализ кода для поддержания качества.
- Настроить проверку типов и интеграцию с CI для предотвращения ошибок.
- Организовать нагрузочное тестирование backend для оценки производительности.
- Создать документацию API с использованием Swagger или OpenAPI.
- Внедрить систему код-ревью и стандарты кодирования для команды.

---

## 🧠 Как работает

При старте backend:  
- Express-сервер по умолчанию поднимается на :3001 (изменяемо через переменную `PORT`)  
- Все изображения сохраняются в `/uploads` и доступны по `/uploads/:filename`  
- JSON-файл `users.json` используется как "база данных"  

При старте admin:  
- React SPA работает через Vite на :5173  
- Все запросы идут через fetch к backend  
- При изменении данных — срабатывает debounce и отправляется PUT  

---

## 📄 Лицензия

MIT — делай что хочешь, но оставь упоминание автора.
> Автор: [nabludatel] \ 2025

---

## 🛡️ Аутентификация и авторизация

### Backend (Express)
- Для всех защищённых маршрутов (`/api/users`, `/api/upload`) используется middleware `requireAuth` (`backend/middlewares/authMiddleware.ts`), который проверяет наличие и валидность токена в заголовке `Authorization: Bearer <token>`.
- Если токен отсутствует или невалиден, сервер возвращает 401/403 и логирует попытку доступа с деталями (IP, время, метод, URL, причина отказа).
- Пример защищённого подключения роутов:
  ```js
  app.use("/api/users", requireAuth, usersRouter);
  app.use("/api/upload", requireAuth, uploadRouter);
  ```
- Для аутентификации реализован роут `/api/auth/login` (см. `backend/routes/auth.ts`), который возвращает токен при успешном логине.

### Frontend (React)
- Для доступа к приватным страницам используется компонент `ProtectedRoute` (`admin/src/components/ProtectedRoute.tsx`), который проверяет наличие токена в localStorage и редиректит на `/login` при его отсутствии.
- В компоненте `Layout.tsx` также реализована проверка роли пользователя (из localStorage) и logout.
- Все запросы к защищённым API должны отправлять заголовок `Authorization: Bearer <token>`.  
  **Пример:**
  ```js
  fetch("http://localhost:3001/api/users", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
  ```
- В случае ошибки авторизации (401/403) рекомендуется логировать ошибку на клиенте через `console.warn` для мониторинга.

### Пример логина на фронте:
```js
const res = await fetch("http://localhost:3001/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
if (res.ok) {
  const data = await res.json();
  localStorage.setItem("token", data.token);
  navigate("/users");
}
```

---

## 🗂️ Страницы и маршруты

- `/login` — страница входа (LoginPage), не требует авторизации.
- `/users` — управление пользователями (UsersPage), требует авторизации.
- `/settings` — настройки (SettingsPage), доступно только для admin.
- `/` — дашборд (DashboardPage), требует авторизации.

---

## 🧩 Архитектура компонентов

- **Layout.tsx** — обёртка для всех приватных страниц, реализует навигацию, проверку роли, logout.
- **ProtectedRoute.tsx** — компонент для защиты маршрутов, редиректит на /login при отсутствии токена.
- **Avatar.tsx** — компонент для отображения аватара пользователя с fallback и обработкой ошибок загрузки.
- **UserRow.tsx** — строка пользователя с inline-редактированием, статусами и кнопками действий.

---

## 🛠️ Безопасность

- Все приватные API защищены через middleware авторизации.
- Логирование всех неудачных попыток доступа (IP, время, причина) на сервере.
- Рекомендуется централизовать обработку fetch/axios-запросов на фронте для автоматического добавления токена и логирования ошибок авторизации.

---

## 🧪 Тестирование

- Для тестирования API используйте Postman/curl с заголовком `Authorization: Bearer <token>`.
- Без токена или с неверным токеном доступ к API невозможен.
- Для UI — попробуйте открыть приватные страницы без авторизации: должен быть редирект на /login.

---

## 📝 Пример .env (если потребуется)

```
PORT=3001  # порт API сервера
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173
```
Переменная `PORT` задаёт порт для backend (по умолчанию 3001).

---

## 🧠 Советы по развитию

- Перевести авторизацию на JWT (сейчас токен захардкожен).
- Централизовать работу с API на фронте (например, через api.ts).
- Добавить хранение и проверку ролей на сервере.
- Вынести email/пароль пользователей в отдельный JSON или БД.
- Добавить refresh-токены и logout на сервере.
# nabludatel.core: Админ-панель и бэкенд

Модульная система для управления пользователями, ролями и аватарами, построенная на TypeScript, Express и React. Проект ориентирован на простую архитектуру, JSON-хранилище и масштабируемость — с возможностью расширения до полноценной CMS или личного кабинета.

---

## 🎯 Цели проекта

- Простой, читаемый и расширяемый стек (без сложных фреймворков, ORM или громоздких библиотек).
- Локальное хранение данных в JSON-файлах (идеально для MVP, прототипов и дашбордов).
- Минимальные внешние зависимости.
- Чёткое разделение клиентской и серверной логики.

---

## 📁 Структура проекта

```
/nabludatel.core
│
├── backend/                   # Сервер на TypeScript + Express
│   ├── index.ts              # Точка входа: инициализирует Express и маршруты
│   ├── config/               # Конфигурация (Multer, CORS и т.д.)
│   │   └── multer.ts         # Настройка хранилища для загрузки файлов
│   ├── db/                   # JSON-файлы как база данных
│   │   └── users.json        # Список пользователей для CRUD операций
│   ├── middlewares/          # Пользовательские middleware
│   │   └── uploadMiddleware.ts # Обработка загрузки файлов через Multer
│   ├── routes/               # API-маршруты
│   │   ├── users.ts          # CRUD для пользователей
│   │   └── upload.ts         # Загрузка изображений
│   ├── utils/                # Утилиты и общие функции
│   │   └── paths.ts          # Определение путей для uploads
│   ├── uploads/              # Папка для сохранённых изображений
│   └── tsconfig.json         # Настройки TypeScript для backend
│
├── admin/                    # Админ-интерфейс (React + Vite)
│   ├── public/               # Статичные ассеты (иконки, favicon)
│   ├── src/
│   │   ├── assets/           # Изображения и медиа для UI
│   │   ├── components/       # Переиспользуемые React-компоненты
│   │   ├── hooks/            # Кастомные React-хуки
│   │   ├── lib/              # API-обёртка для взаимодействия с backend
│   │   ├── pages/            # Страницы приложения
│   │   ├── styles/           # TailwindCSS и глобальные стили
│   │   └── App.tsx           # Главный компонент с роутингом
│   ├── index.html            # HTML-шаблон для Vite
│   ├── tailwind.config.js    # Конфигурация TailwindCSS
│   └── vite.config.ts        # Настройка Vite
│
├── uploads/                  # Alias к backend/uploads для доступа к файлам
├── tsconfig.json             # Общие настройки TypeScript
└── README.md                 # Эта документация
```

---

## ⚙️ Установка и запуск

### 0. Предварительные требования

Убедитесь, что глобально установлены `nodemon` и `tsx`:
```bash
npm install -g nodemon tsx
```

### 1. Установка зависимостей
```bash
cd nabludatel.core
npm install
cd admin
npm install
```

### 2. Конфигурация TypeScript

В корне проекта — общий `tsconfig.json`. В папках `backend/` и `admin/` — локальные конфиги для серверной и клиентской частей.

### 3. Запуск backend
```bash
cd ../backend
npx nodemon --watch . --ext ts,json --exec "ts-node -P tsconfig.json index.ts"
```
Доступно по адресу: `http://localhost:3001` (если не задан `PORT`)

### 4. Запуск frontend
```bash
cd ../admin
npm run dev
```
Доступно по адресу: `http://localhost:5173`

---

## 🧠 API эндпоинты

### Пользователи
```
GET    /api/users        # Получить всех пользователей
POST   /api/users        # Создать пользователя
PUT    /api/users/:id    # Обновить пользователя
DELETE /api/users/:id    # Удалить пользователя
```

**Заголовки:**
```
Content-Type: application/json
Accept: application/json
```

**Пример запроса POST/PUT:**
```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "role": "admin",
  "avatarUrl": "/uploads/avatar.png"
}
```

### Загрузка файлов
```
POST /api/upload         # multipart/form-data, поле: file
```
**Пример ответа:**
```json
{ "url": "http://localhost:3001/uploads/имя_файла.ext" }
```

---

## ✅ Реализовано

- **Backend:** CRUD для пользователей через JSON, загрузка изображений с помощью Multer.
- **Frontend:** Inline-редактирование, debounce-сохранение, отображение статусов операций.
- **UX:** Предупреждение об уходе с несохранёнными изменениями.
- **Инфраструктура:** Чёткое разделение клиент/сервер, минимальные зависимости.

---

## 🛠️ В планах

### Интерфейс
- Модальные окна подтверждения удаления пользователей.
- Фильтры и табы для удобного поиска по ролям.
- Поддержка мультиязычности (RU/EN).

### API и Backend
- JWT-авторизация и разграничение прав.
- История изменений (audit log).
- WebSocket/SSE для обновлений в реальном времени.

### Безопасность
- Защита от CSRF и XSS.
- Rate limiting для API.
- 2FA для администраторов.

### Инфраструктура и DevOps
- CI/CD для автоматического тестирования и деплоя.
- Централизованное логирование и мониторинг.
- Docker-контейнеры для упрощённого развёртывания.

### Масштабирование
- Переход на SQL или NoSQL БД (PostgreSQL, MongoDB).
- Горизонтальное масштабирование backend.
- CDN для отдачи статичных файлов.

### Интеграции
- OAuth и LDAP для аутентификации.
- Вебхуки и интеграции с внешними сервисами.

### Тестирование и качество
- Jest/Supertest для API тестов.
- Cypress/Playwright для E2E.
- Документация API через Swagger/OpenAPI.

---

## 🗂️ Как это работает

- Backend запускается на порту 3001 по умолчанию (значение можно изменить через `PORT`), хранит данные в `backend/db/users.json`.
- React SPA (admin) делает запросы к backend и отображает UI.
- Загрузка файлов сохраняет их в `uploads/` и возвращает URL.

---

## 📄 Лицензия

MIT — свободное использование с сохранением указания авторства.

---

## 🏗 Архитектура и масштабируемая CMS-платформа

Ниже представлена развёрнутая структура проекта для многоарендной CMS-платформы в стиле Tilda/Webflow.

### 📂 Структура монорепозитория

```
myCMS/
├── apps/
│   ├── backend/          # Node.js + Express API для управления данными (пользователи, сайты, контент)
│   ├── admin/            # Админ-панель платформы (React + Tailwind)
│   ├── client-admin/     # Админ-панель клиента (React + Tailwind)
│   └── kyanchir/      # (опционально) Next.js или сборка статических сайтов
├── packages/
│   ├── core/             # Общие TypeScript-модели, бизнес-логика, утилиты
│   ├── ui/               # Переиспользуемые UI-компоненты
│   │   ├── HeroSection   # Простой блок приветствия
│   │   └── Footer        # Минимальный футер сайта
│   └── config/           # Общие конфигурации (ESLint, Tailwind и т.д.)
├── sites/                # Сгенерированные статические сайты клиентов
├── pnpm-workspace.yaml   # Определение workspace для pnpm
└── turbo.json            # Конфигурация Turborepo
```

### 👥 Модель пользователей и сайтов

- **User**: `{ id, name, email, passwordHash, role, allowedSiteIds[] }`.
- **Site**: `{ id, name, ownerUserId, domain, templateId, plan, status }`.
- **Многие-ко-многим**: при необходимости несколько пользователей на сайт через таблицу UserSites или поле `allowedSiteIds`.
- Все данные (страницы, медиа) связываются с `siteId` для изоляции аренд.

### 🔑 Аутентификация и авторизация

- JWT-аутентификация, токен в `Authorization: Bearer <token>`.
- Роли: `superadmin` (полный доступ) и `client` (доступ только к своим сайтам).
- Middleware на backend:
  - `ensureAuthenticated` проверяет JWT.
  - `ensureSuperAdmin` разрешает только супер-админу.
  - `ensureSiteAccess` проверяет, что пользователь имеет доступ к `siteId`.

### 🌐 Рендеринг и хостинг клиентских сайтов

Два подхода:
1. **Мультиарендное приложение** на Next.js: одно приложение обрабатывает все запросы по поддоменам, динамически подгружает данные.
2. **Статическая генерация**: при каждой публикации формируются HTML/CSS/JS файлы в `sites/<site>/`, которые развёртываются на CDN или через Express static.

Рекомендация: начать со статической генерации для простоты, затем перейти на Next.js для SSR/ISR.

### 🚀 Масштабирование и будущее расширение

- **Stripe**: интеграция подписок, хранение `stripeCustomerId` и `stripeSubscriptionId` в записи сайта.
- **Планы и ограничения**: Free/Pro/Enterprise с разными квотами (страницы, домены, пользователи).
- **Шаблоны**: создание готовых тем и блоков, позволяющих быстро стартовать.
- **Инфраструктура**: единый API-бэкенд stateless, горизонтальное масштабирование, CDN для статики.
- **Мониторинг и логирование**: интеграция с Sentry, Prometheus/Grafana или аналогами.
- **DevOps**: CI/CD, Docker-контейнеры, автоматические бэкапы.
- **Будущие функции**: мультиязычность, редактор drag-and-drop, White-label, интеграции (OAuth, LDAP), аналитика.
```


Архитектура масштабируемой многоарендной CMS-платформы

**Обзор:** Данная архитектура описывает масштабируемую платформу для создания сайтов/CMS в стиле Tilda/Webflow с чётким разделением областей ответственности: общий модуль (core), API-бэкенд, админ-панель владельца платформы, клиентские админ-панели и отдельно разворачиваемые клиентские сайты. Документ охватывает структуру проекта, модель данных (управление несколькими сайтами для пользователей), аутентификацию/авторизацию (доступ супер-админа vs. клиента), стратегии рендеринга и хостинга клиентских сайтов (генерация статических шаблонов или SSR), а также планы по масштабированию (подписки, многоуровневые функции, система шаблонов и т. д.).

**Структура проекта и организация монорепозитория:** Проект организован как монорепозиторий (с использованием pnpm workspaces и Turborepo для эффективного билда), содержащий несколько приложений и общих пакетов. Возможная структура директорий:

myCMS/
├── apps/
│   ├── **backend/**        # Node.js (Express) API server – handles data for sites, users, content
│   ├── **admin/**          # React + Tailwind app – platform owner admin panel (super-admin interface)
│   ├── **client-admin/**   # React + Tailwind app – client admin panel (each client manages only their site)
│   └── **kyanchir/**    # (Optional) Next.js app or static site generator for client sites (SSR or static export)
├── packages/
│   ├── **core/**           # Core TypeScript library – business logic, shared types/interfaces, utilities, validators
│   ├── **ui/**             # (Optional) Shared UI components library (buttons, form fields, etc. for reuse in admin apps)
│   └── **config/**         # (Optional) Common configuration (TS configs, ESLint, Tailwind config, etc.)
├── **sites/**              # Output directory for generated client sites (e.g. `sites/site-abc/` for site "ABC")
├── pnpm-workspace.yaml     # Defines workspace structure for PNPM
└── turbo.json              # Turborepo configuration for running builds/tests in parallel

### 🏗 Обоснование использования монорепозитория

Такая структура позволяет каждому приложению разрабатываться и развёртываться независимо при при этом разделяя общий код через пакеты (такие как core и ui). Админ-панели и бэкенд могут импортировать типы и логику из core для обеспечения согласованности. Мы используем pnpm workspaces для управления зависимостями и Turborepo для ускорения сборки за счёт кэширования и параллельных задач. Каждое приложение имеет собственную конфигурацию (собственный `package.json` и скрипты сборки), а общие скрипты и dev-зависимости вынесены в корень.

### 📂 Распределение обязанностей между папками

• **core/** – бизнес-логика и общие определения: модели TypeScript (User, Site, Page), схемы валидации, утилиты и функции для рендеринга шаблонов.
• **backend/** – Node.js + Express API для headless CMS: управление пользователями, сайтами и контентом. Маршруты разделены на `admin/` (для супер-админа) и `site/` (для клиентов). Хранилище данных — JSON с возможностью перехода на MongoDB или SQL.
• **admin/** – админ-панель платформы (React + Tailwind) для супер-админа: создание и управление сайтами, аккаунтами, правами и настройками.
• **client-admin/** – панель управления сайтом для клиентов (React + Tailwind): редактирование страниц, загрузка медиа и настройка параметров своего сайта.
• **kyanchir/** – (опционально) приложение на Next.js или статический генератор для рендеринга и деплоя клиентских сайтов (SSR/ISR или статическая сборка).
• **sites/** – директория с готовыми сайтами клиентов (HTML, JS, CSS, медиа) для отдельного деплоя или обслуживания через CDN.

### 🔗 Общий код

Пакет **core** содержит переиспользуемый код: модели и типы TypeScript, утилиты для работы с данными и функции рендеринга компонентов. Он используется всеми частями системы для обеспечения единых бизнес-правил и структуры данных.

### ⚙️ Процесс разработки и сборки

Мы используем Turborepo и pnpm-workspaces для параллельной разработки и сборки всех пакетов. Команда `pnpm run dev` в корне запускает backend и оба frontend-приложения одновременно. Конфигурации `pnpm-workspace.yaml` и `turbo.json` обеспечивают кэширование сборок и ускоряют работу при неизменном коде в ядре.

User Model & Site Management

Managing users and their associated sites is critical for multi-tenancy. We need a data model that allows one client to have one or multiple sites, and possibly multiple users to collaborate on one site. We also need to differentiate between super-admin (platform owner) and client users.

Data Models:
	•	User: Each user account has an id, name, email, hashed password, and a role field (e.g. role: "superadmin" for you, and role: "client" for client users). Additional fields can include contact info or preferences. Importantly, a user needs to be linked to the site(s) they can access. There are a few ways to model this:
	•	If using a relational database (like PostgreSQL), you can have a Users table and a Sites table, and a join table UserSites that links users to sites (many-to-many relationship). Each entry in UserSites might include a userId, siteId, and possibly a role or permission level on that site (for example, one user might be the owner of a site, and in the future you might allow additional users with editor access).
	•	If using a document database (like MongoDB), you could either embed an array of site references in the user document (e.g. user.sites = [siteId1, siteId2]) or have a separate collection for user-site relationships. Either way is fine; embedding is simpler for one-to-few relationships, but a separate collection might be more flexible for many users and many sites.
	•	Site: Each site has an id (unique site identifier), a name, and likely an owner reference. For example, the Site record might have a field ownerUserId (if you assume one primary owner). If multiple owners or collaborators are allowed, you omit a single owner field and rely on the UserSites mapping. The Site record can also store metadata: e.g. site subdomain or custom domain, creation date, status (active/disabled), plan or tier, and possibly a pointer to which template it was created from (if using site templates). If you plan to allow multiple site templates/themes, storing a templateId in Site could be useful so you know which base layout to apply.
	•	Content: The actual content of each site – pages, posts, images, etc. – will be stored in collections that include a reference to the site. For instance, a Pages table/collection would have fields like id, siteId, title, content, .... The siteId foreign key ensures that pages are linked to a specific site. This is essential for multi-tenancy: every content item must be scoped to a tenant. In a relational DB, you’d index by siteId (and perhaps partition data by site if needed); in a NoSQL DB, you might even store each site’s content under a site document. The key point is data isolation by tenant ID – no mixing of one site’s content with another’s without a clear boundary.

Storing a siteId on all relevant data is the simplest way to separate each customer’s data in a single database. It ensures queries can be filtered per tenant, which is crucial for both security and scalability ￼. (In larger-scale scenarios, one might even use separate databases or schemas per tenant for isolation, but that adds complexity – see below for scaling thoughts. Initially, a single database with tenant IDs is fine and far easier to manage.)

Linking Users to Sites: When you create a new site for a client, you will also create a user (or associate an existing user) as the owner. For example:
	1.	Super-admin creates a site – via the admin panel, you fill in details like site name (and maybe pick a template). The backend API endpoint (perhaps POST /admin/sites) receives this and creates a new Site entry (generating a site ID, etc.).
	2.	Create client user account – If the client is new, you also create a User with role “client”. The backend might provide an endpoint like POST /admin/users which creates a user and at the same time links them to the site. This could be done by creating an entry in UserSites or by updating the user’s sites field to include the new site’s ID. For convenience, the API could allow including a new user’s details when creating a site.
	3.	Link existing user to additional site (if needed) – If a client already has an account and is adding another site, you simply create the Site entry and then update the linking (e.g., insert a new UserSites record). This way, one client login can toggle between multiple sites they own.

The platform admin interface should present an intuitive way to manage this. For instance, you might have an “Invite User” or “Assign User to Site” function. Initially, even limiting one user per site (one owner) is okay; but designing the schema with many-to-many in mind (so it’s easy to have, say, a team of users managing one site in the future) is forward-looking.

When a new site and user are created, the backend should ensure consistency: e.g. it might create the site, create the user, then create the link between them ￼ (if any step fails, it should roll back, to avoid orphaned sites or users). All site IDs and user IDs need to be unique (likely auto-generated like UUIDs or database sequences).

Super-Admin vs Client Data: The super-admin (you) can have access to all sites. One way to implement this is simply: your User record has role: "superadmin". In queries, the backend can check this role – if superadmin, ignore site filters and allow access to any data. You might not even include any site references for the superadmin user, since by definition you oversee all. (However, in some implementations, even the superadmin might have a list of sites they “own” in a special collection – e.g. a global table of tenants – but that’s not necessary if role alone can grant access to everything.)

Clients, on the other hand, should only see their own sites’ data. Therefore:
	•	If a client user has one site, you can store that directly (like user.siteId = X). But since we allow multiple, better to relate via a list or join table as described.
	•	All client queries to the backend must include or infer the site context, and the backend will enforce that the user has access to that site.

For example, if a client calls GET /api/pages?siteId=ABC, the backend middleware will check the JWT, find user X, see that user X is linked to site “ABC”. If yes, proceed and filter Pages where siteId = ABC. If not, the request is forbidden. This way, clients can never retrieve or modify data from another site.

This approach can be implemented robustly with an access control layer or simply in each query:
	•	If using an ORM, you might have a global query filter that automatically adds WHERE siteId IN [allowedSites] for the authenticated user (unless they’re superadmin). For instance, in a Mongo query you’d add { siteId: { $in: user.allowedSiteIds } }.
	•	Some frameworks or ORMs support multi-tenant patterns out of the box. If not, a simple check in each route handler works too.

From the perspective of multi-tenancy best practices, isolating each tenant’s data is paramount for security and scalability. It means your data model should always treat siteId almost like a required parameter in any query for content ￼. In addition, you could implement a soft delete or disable on sites: e.g. if a subscription expires, mark a site as disabled in its record so that the content stays in the DB but the site won’t be served publicly (the backend can check a flag before serving content).

Example: Suppose client Alice has two sites: “CafeSite” and “BlogSite”. In the database, Alice’s user record is linked to site IDs 101 and 102. When Alice uses the client-admin UI for “CafeSite”, the requests she makes will include siteId=101 (or the backend infers 101 from context), and the API will ensure all data ops apply to site 101 only. If Alice tries any request for siteId=999 (not hers), the authorization layer will block it. On your side, as super-admin, you might have an admin UI screen to view “All Sites” which behind the scenes calls an admin API to list sites without filtering by siteId (since you have permission to see all).

Organizing Tenants in the Database: At scale, you might implement a dedicated Tenants collection that lists each site (tenant) and some meta-info – essentially a registry of all sites. The super-admin could consult this to see all tenants, their status, plan, etc. In a simple setup, the Sites table itself serves this purpose (each row is a tenant). In more complex scenarios, you might have a “master” database for tenancy info and separate databases for content. For now, consider the Sites table the canonical list of tenants.

This central Sites list can also track things like module access or feature flags for each site (for example, which premium features are enabled for this tenant’s plan) ￼. We will expand on this in the scaling section, but it’s worth noting that the data model should be able to accommodate additional per-site settings (like plan tier, enabled features, etc.).

Authentication & Authorization

For authentication, we’ll use a JWT-based system with tokens stored on the client side (in localStorage for now, as specified, though eventually using secure HTTP-only cookies would be safer). Authorization will be role-based: distinguishing the super-admin versus regular client users, and ensuring each can only access the appropriate resources.

Auth Flow:
	•	A user (whether super-admin or client) logs in through the appropriate UI (the admin panel or the client-admin panel). On login, the backend /auth/login endpoint checks the credentials (e.g. email & password). If valid, it creates a JWT signed with the server’s secret key. The JWT payload typically contains the user’s ID and role, and possibly some metadata like name or an expiration time.
	•	The JWT is returned to the front-end and stored (in localStorage in this case). We then include this token in the header (usually the Authorization: Bearer <token> header) of each subsequent API request.
	•	The backend has a middleware that runs for protected routes: it reads the JWT from the header, verifies it (ensures it’s not expired and the signature is valid), and then extracts the payload (user ID, role, etc.). It then attaches something like req.user = { id: ..., role: ..., ... } for use in downstream handlers.

Super-Admin vs Client Rights:
	•	The super-admin account (your account) will have role = superadmin in the JWT. This role grants full access. The backend can check for this role to allow privileged operations. For example, an endpoint like GET /admin/all-sites would first verify req.user.role === 'superadmin' before proceeding to fetch all sites.
	•	Client users have role = client (or you can define multiple client roles later, like client-owner, client-editor, etc., but initially one role is fine). Their JWT might also include the list of site IDs they have access to, although storing that in the token could lead to very large tokens if a user had many sites. It might be simpler to not put that in JWT, and instead query the database for the user’s sites when needed (or cache it in server memory for the session).

Authorization logic ensures:
	•	Super-Admin can access everything: The backend might bypass tenant filtering if role === 'superadmin'. Alternatively, for uniformity, you could also treat the super-admin as having access to all site IDs (so you still apply the filtering logic but the super-admin passes because all site IDs are in their allowed list). Either approach works. The key is to implement checks such that non-admins cannot bypass the tenant restrictions.
	•	Clients can only access their site: As described earlier, when a request is made, say to PUT /api/sites/101/pages/55 (update page 55 on site 101), the backend will verify that the req.user.id is associated with site 101. If not, it returns 403 Forbidden. This check can be done by looking up the user’s sites (e.g., query a UserSites table or a cached list). If the user is indeed linked to that site, the operation proceeds. Otherwise, it’s blocked.

For convenience in the client-admin front-end, if a user only has one site, the UI can be simplified to always operate on that site (no need to ask which site). If a user could have multiple sites, you’d provide a way to switch context (perhaps a dropdown or a subdomain per site for the client admin app). A simple implementation for multi-site users is to have them select the site after login (or include the site in the URL they use to access the client-admin). For instance, you might host client admin at a URL like client.yourplatform.com?site=ABC or use subdomains like abc.yourplatform.com/admin – which then corresponds to site ABC. Using subdomains is neat because the subdomain can implicitly identify the site context, which the backend middleware can parse and use for authorization (this is how some multi-tenant apps work ￼). Alternatively, store a “current site” in local state (or even in the JWT as a claim that can change when the user switches site).

Protecting Routes: In Express, you can create middleware functions such as ensureAuthenticated and ensureRole. For example:

// Pseudocode for an Express middleware
function ensureAuthenticated(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('No token');
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload; // payload contains userId and role
      next();
    } catch(e) {
      return res.status(401).send('Invalid token');
    }
}
function ensureSuperAdmin(req, res, next) {
    if (req.user?.role !== 'superadmin') {
      return res.status(403).send('Forbidden');
    }
    next();
}

Then you can apply ensureAuthenticated to all API routes, and ensureSuperAdmin only to admin-only routes. Similarly, for site-specific routes, you might have an ensureSiteAccess middleware:

function ensureSiteAccess(req, res, next) {
    const siteId = req.params.siteId || req.body.siteId || req.query.siteId;
    if (!siteId) return res.status(400).send('Site ID required');
    if (req.user.role === 'superadmin') {
       return next(); // superadmin bypass
    }
    // If user is client, check their allowed sites
    const allowedSites = getUserSitesFromDb(req.user.id); // (maybe cached)
    if (!allowedSites.includes(siteId)) {
       return res.status(403).send('Forbidden');
    }
    next();
}

This is a simplistic outline, but it conveys the idea: every request is authenticated and then authorized based on role and ownership. In practice, you may combine checks (e.g., an admin route might require both ensureAuthenticated and ensureSuperAdmin, whereas a site content route requires ensureAuthenticated and ensureSiteAccess).

Password Security: Ensure that user passwords are hashed (e.g., using bcrypt) in storage. The auth system can initially be JWT with email/password, but consider allowing OAuth or SSO for future expansion (especially if targeting enterprise clients, SSO could be a feature). For now, a simple JWT auth over HTTPS is sufficient.

Session Management: JWTs by nature are stateless (no server session needed), which is good for scalability. You might implement token expiration (say tokens valid for 24h) and refresh logic later. With localStorage, if the token is compromised via XSS it’s a concern, but given this is an internal project at early stage, you can accept that trade-off and later move to HttpOnly cookies for better security.

Admin Authentication: You could run separate login pages for admin and client (as you likely will). The backend can even have separate endpoints or handle it in one (it can check credentials and role and issue token accordingly). There’s no need for a separate auth system – both use JWT, just with different roles.

Enforcing Access in UI: On the front-end side, both React apps (admin and client-admin) should also enforce some gating:
	•	The admin app should only allow login with a super-admin credential. You may hardcode that only certain emails can login here, or simply rely on the backend to reject non-admin users on the admin endpoints.
	•	The client-admin app, once logged in, should clearly only show content for that user’s site(s). E.g., it can fetch a list of pages and the backend will already filter by user, but also the front-end routing might reflect the site (like /site/ABC/pages). If a logged-in client somehow tries to manipulate the front-end to point to another site ID, the backend will stop them, as described. So the UI just needs to handle the normal case; malicious attempts are handled by the server checks.

Super-Admin Visibility: As super-admin, you might want through your admin panel to “impersonate” or view a client’s site content. You can implement this by either:
	•	Having your admin frontend call the same site-specific APIs but with your super-admin token and specifying a siteId for which site you want to manage. Because your token is superadmin, the backend will allow it (it sees you have access to all sites). Essentially, you can build features to edit any site’s content directly, or view it, using your privileges.
	•	Alternatively, you could even generate a special link or token to log into the client-admin as that client (impersonation), but that’s more complex and usually not needed if your admin panel directly can do the management.

Role-Based UI: In the future, if you add more roles (for example, you might have a concept of a “team member” who can only edit content but not change billing, or an “admin” vs “editor” within a client site), you will extend both the data model and the role checks. A UserSites join table could carry a role field (like user X is an “editor” on site Y). The UI would then respect that (editors might not see certain settings pages, etc.), and the backend would enforce it too (e.g., an editor can edit pages but maybe not publish or not invite new users). These finer permissions can be layered on later. The architecture is already set up to handle role-based access control, as we are distinguishing at least two roles from the start ￼ ￼.

In summary, the auth system ensures global admins see all data, while client tenants are restricted to their own ￼. JWT with role claims is used to identify the user, and every request is checked for the appropriate permissions. This protects sensitive data and maintains isolation between tenants, which is a fundamental requirement in a multi-tenant architecture ￼.

Client Site Rendering & Deployment

One major challenge is how to host and render the client websites themselves. The platform should allow each client’s site to be served separately (e.g. on a unique domain or subdomain), using a template-based rendering system. We want flexibility to either generate static sites or use server-side rendering (SSR), depending on needs. Here’s how we can achieve this:

Template-Driven Site Rendering: We will build the sites using a system of templates or components, rather than each site being completely bespoke code. This is akin to how Webflow or Tilda works – users assemble pages from high-level building blocks. In our case:
	•	The core package (or a sub-package in it) will contain a library of reusable page sections/components (hero banners, image galleries, text blocks, forms, etc.) that can be composed into pages. These can be implemented as React components (if using a React/Next rendering pipeline) or as HTML/Handlebars templates (if using a simpler static generator).
	•	Each page in a site can be represented by a structure (perhaps JSON in the database) that lists which components (sections) appear in what order, along with the content for each (text, images, etc.). For example, a page JSON might say: [ { type: "HeroBanner", props: { title: "Welcome", imageId: "123" } }, { type: "TextBlock", props: { text: "About us ..." } } ]. This data-driven approach allows the rendering engine to loop through and render each section using the corresponding template.
	•	Alternatively, some sites might be based on a fixed template (like a theme) where the layout of pages is predefined. In that case, the Site record might have template: "restaurant-theme" and the code has a template for that theme’s homepage, about page, etc., where content slots are filled in. This is a bit less flexible for the user but easier to implement initially. Over time, you likely want a more flexible block-based system.

Given that in the tech stack Next.js is a consideration, a logical approach is:
	1.	Use Next.js for site rendering, taking advantage of its React-based templating and ability to do either static export or SSR. Next.js would allow us to define React components for each section template. We could fetch the page structure and content from the backend (if doing SSR) or embed it at build time (for static generation).
	2.	Next.js also simplifies routing for multiple pages and can optimize assets, etc. Each site’s pages can be dynamic routes in Next.

There are two key architecture choices for multi-tenant site hosting:
	•	A single multi-tenant Next.js application serving all sites (with dynamic routing based on domain or path).
	•	Separate static builds or apps per site (each site’s files can be built and deployed independently).

Option 1: Single Multi-Tenant App (Dynamic subdomains) – In this model, you have one Next.js app that knows how to render any site based on the request’s domain or a path parameter. For example, you deploy an app that listens on *.yourplatform.com (wildcard subdomain). For a request to alice.yourplatform.com/page1, a Next.js middleware or server logic determines that alice is the site identifier, fetches Alice’s page1 content from the DB, and renders it on the fly. Vercel’s Platforms Starter Kit is an example of this architecture: each tenant gets their own subdomain, a middleware routes requests to the correct tenant content, the main domain can host a landing and admin panel ￼. Shared components and layouts are reused across tenants, just populated with different data ￼. This approach means you maintain one deployment (codebase) for all sites, which is convenient for updates – deploy once, all sites run the latest code. It also makes SSR or on-demand rendering straightforward (since the app can fetch from DB and render for each request).

However, Option 1 requires careful handling of tenant separation in the code, and if one app goes down it affects all sites (not true isolation). Also, heavy traffic on one site could potentially impact others, since they share runtime (though you can scale horizontally and use caching to mitigate this).

Option 2: Separate Build per Site (Static or SSR) – Here, each site is effectively a separate application or at least a separate bundle of files. This aligns with the sites/ directory approach where, for example, when Alice’s site is published, we generate a set of static files in sites/alice/ that can be served independently. These static files could be deployed to a CDN or a storage bucket (even packaged into an AWS S3 + CloudFront, or served by Nginx). If we needed SSR for a site, we could even spin up a dedicated Node process or serverless function for that site (though that’s usually overkill unless the site is huge or needs custom backend code).

The static site generation approach is powerful: it allows extremely fast serving (just files on CDN), and complete isolation (one site’s deployment is just its files). Webflow, for instance, hosts each site as static content on their CDN (with an option to export code). Our platform can do something similar: whenever the client publishes changes, we run a generator that produces HTML/JS/CSS for their site and push it to hosting.

We can also combine the approaches: use Next.js to generate static pages per site. Next can be instructed to export a static version of the site. If we script it, we could loop over each site and run a static export for it (each with different data). This might be something like:

next build && next export -o sites/site-ABC/

with environment variables or configs telling the Next app “build for site ABC now” (perhaps by setting SITE_ID=ABC so that Next’s data fetching knows which site to pull). This would yield static files in sites/site-ABC. Then do the same for site DEF, etc. This is somewhat complex to automate if there are many sites, but it’s feasible and can be optimized (only rebuild sites that have changes, etc.).

Initial Approach Suggestion: Start with static generation for simplicity. For each site:
	•	Use the backend admin or a CLI to trigger a build when content changes (or on demand).
	•	The build process takes the site’s content (pages, etc.) from the DB and applies it to templates to produce static HTML files (and perhaps a bundle of JS/CSS).
	•	Place those files in sites/<site-name>/ and serve them. You could serve them either by a simple Express static-server (e.g. Express can serve static files from that folder when a request comes for that site’s domain) or by uploading them to a static hosting service.

For development, static generation means you might not see changes instantly without re-generating, but since this is a CMS, a “Publish” button that regenerates the site is acceptable.

Hosting & Domains: To host separately, each site can have its own domain or subdomain. For example, you might give clients a default subdomain on your platform like <site>.yourplatform.com. In DNS, you’d have a wildcard CNAME so that *.yourplatform.com points to your hosting server. If a client adds a custom domain (like example.com), you’d ask them to point an A record to your server or use a CNAME to your domain – then your server can serve their static files when it sees that host header.

If you go with the single multi-tenant app approach, implementing subdomain routing is crucial. As mentioned, a Next.js middleware can parse the host to get the tenant name and then load appropriate data ￼. In an Express setup, you can similarly use req.hostname to identify the site. Many multi-tenant systems do something like:

app.use((req, res, next) => {
  const host = req.hostname; // e.g., "alice.yourplatform.com"
  const siteName = host.split('.')[0]; // "alice"
  req.tenant = siteName;
  next();
});

Then use req.tenant to fetch content. If using custom domains, you’d maintain a mapping of domain -> siteId in your database so you can look up which site to serve for a given host.

If you choose separate static hosting per site, you might deploy each site’s files to a storage bucket or separate CDN endpoints. For instance, you could integrate with a service like Netlify or Vercel via their APIs to deploy each site’s static files to .yourplatform.com domain. However, managing hundreds of separate deployments might be complex, so many will prefer the single-app approach until it’s untenable.

SSR vs Static Trade-offs: Static sites (pre-rendered) are extremely fast and cost-efficient to serve (no server compute on each request, just CDN). They are ideal for content that doesn’t change every second. Given that this is a CMS for marketing sites, static is often fine – changes are only seen after publishing, and real-time data isn’t usually needed on the site pages themselves. We can still incorporate dynamic elements (like a contact form) via client-side JS or simple API calls (e.g., the static page has a form that posts to the backend API for submission handling).

SSR (server-side rendering) is useful if:
	•	You want to render on-demand without a publish step (e.g., the moment a user updates content, it’s live, because the next request fetches latest from DB).
	•	Or if you need to incorporate user-specific personalization at render time, or frequently changing data (like showing live inventory, etc.).
	•	SSR can also simplify things if not doing a full static build for each change, but you then need a caching layer to handle high traffic.

Next.js gives a middle ground: Incremental Static Regeneration (ISR), where you can statically generate pages but also have them revalidate at intervals or on demand. That could be a future optimization.

Given the user’s mention “generate as static or SSR”, it sounds like they want the flexibility of both. We can satisfy that by building on a framework (like Next) that supports both modes, or by designing our template system to be usable in both contexts. For example, if we write React components for each section, we can use them to do a full static render (to HTML) or to serve via a Node server per request. Using React with hydration would also allow some interactive client-side features on what is otherwise static content.

Next.js Transition: If initially we don’t use Next (say we use a simple static generator with something like Handlebars or custom React rendering script), we should keep the door open to migrate to Next.js for the site rendering. In practice, adopting Next.js early might save effort: we can create a Next app that either runs in multi-tenant mode or can be executed for static builds per site. Next.js 15+ with App Router even allows multiple domains easily and is well-suited for multi-tenant SaaS ￼ ￼. For instance, you could have a single Next codebase but still output static files per tenant if needed by running builds in a loop.

To illustrate, a multi-tenant Next.js architecture might work as follows:
	•	The Next app has an [...site].tsx catch-all route (or uses middleware) that captures the host or a path segment as the site identifier.
	•	It then fetches data (either at request time for SSR via getServerSideProps, or at build time via getStaticProps for static export) for that site.
	•	Pages are rendered using components from core. The content is injected into those components.
	•	Next can produce a distinct HTML page for each site’s each page if doing static export, or one handler that covers all if doing SSR.

There’s even official guidance and an example by Vercel for multi-tenant Next apps (with custom domains) because it’s a common pattern ￼. This validated approach can be a north star for our implementation.

Hosting Environment: Where do these sites live in production?
	•	If static: you can serve them via a CDN. Perhaps the simplest is to use the backend itself to serve static files from the sites/ directory. For example, Express can be configured with app.use('/site-ABC', express.static(path.join(__dirname, 'sites/site-ABC'))) for each site. But doing that manually for each might be tedious. A dynamic approach: when a request comes in, determine site and serve from that folder. If you use Nginx, you could also have Nginx map domains to folder paths.
	•	If SSR: you’d deploy the Next.js app (or similar) on a server (or serverless platform like Vercel). For custom domains, you’d configure them to point to that deployment. (Vercel, for instance, makes it easy to map many custom domains to one project, which is exactly for this multi-tenant case).
	•	If using separate Next apps per site (not recommended unless each site is heavily customized), you’d have to manage dozens of deployments, which is complex. Better to have one runtime.

Static + API Hybrid: One could choose to serve mostly static content but still use the central backend for certain dynamic features. For instance, you might embed a small JS snippet on each page that calls the backend for, say, a newsletter signup or to load more content asynchronously. This keeps pages static but allows dynamic extensions. The backend API (Express) can handle those form submissions or dynamic requests uniformly for all sites (with the same tenant checks).

Media/Assets: All user-uploaded images or media for sites need hosting too. A typical approach: store them on something like AWS S3 or another storage service, organized by site. e.g., files might be under bucket/<siteId>/.... You could also store them on your server’s filesystem under sites/site-ABC/media/. Serving media could either go through the backend (e.g., an Express route streaming the file after auth, if private) or be directly accessible if public. Likely, images on a website are public (not sensitive), so storing them in a public bucket or public folder is fine. Just ensure each file’s URL is unique enough (e.g. include siteId in the path) so no collision and some obscurity.

SEO and Meta: Since clients will use these sites for marketing, SEO is important. The template system should allow setting per-page meta titles, descriptions, maybe slugs for URLs, etc. If generating statically, ensure those are in the rendered HTML. If SSR, ensure server responses contain the proper meta tags. Also, generating sitemaps per site and perhaps handling things like Open Graph tags or social previews could be features to consider. We might allow clients to manage these in their admin (e.g., an SEO settings section for each page and site).

Example scenario using the architecture:
	•	A client logs into their client-admin and adds a new page “About Us”, drags some components (Hero and TextBlock) and enters text. When they hit save/publish, the client-admin calls the backend API to save this page structure in the DB for site ABC.
	•	The client then hits “Publish Site”. The backend (or kyanchir service) takes site ABC’s data and either:
	•	Static case: generates sites/ABC/about-us.html (and updates any navigation menus, etc.) and marks the site as published. Now, when someone visits abc.yourplatform.com/about-us, the server serves that static file.
	•	SSR case: or, if using SSR, it simply means the new content is already in the DB; the Next.js app will now render the updated “About Us” on the fly when requested, since it pulls from DB (or you may have a cache flush mechanism).
	•	Either way, the new page is live. The client’s custom domain (say www.clientsite.com) is CNAME’d to abc.yourplatform.com, so the content shows up on their domain seamlessly.

Both approaches aim to ensure each client site is an independent unit in terms of content and URL space, even if under the hood we reuse infrastructure.

Custom Domains & SSL: If clients use custom domains, you will need to handle SSL certificates. One common approach is to use Let’s Encrypt to issue certificates for each custom domain. There are ACME integrations or services (like Caddy server or Let’s Encrypt libraries) that can automate this. On platforms like Vercel, this is abstracted. But if self-hosting, be aware of this requirement. In early stages, you might disallow custom domains and just use subdomains of your platform to avoid the complexity, then add custom domain support later.

Summary of recommendations for site hosting:
	•	Use template-driven rendering – define a set of components for site pages in the core. This yields consistency and ease of updates (change a template component in core, and many sites can get that update on next publish) ￼.
	•	Start with static generation for simplicity: it’s easier to debug and you can leverage CDN delivery. Over time, integrate Next.js to leverage SSR and incremental builds as needed (the transition is natural since Next can do both).
	•	Structure the system so that each site’s content can be built/served in isolation (whether via a folder or a domain partition in a running app). This way you truly have the option to “host separately” if needed – e.g., you could even hand over the static files to a client if they insisted on self-hosting (like an export feature).
	•	Implement domain-based routing for multi-tenancy. E.g., main platform admin might live at admin.yourplatform.com, client admin at editor.yourplatform.com or similar, and client sites at [site].yourplatform.com. Middleware can map subdomains to site IDs ￼. Eventually, allow mapping custom domains by storing domain->site mapping in the DB.
	•	Ensure the sites are secure and sandboxed – e.g., one site’s content should not be able to execute sensitive operations of the platform. If you allow custom code injection (like custom HTML or scripts) as a feature, you’ll need to sandbox that (likely you won’t initially, but maybe in advanced plans you could allow adding custom HTML blocks or JS – that needs security review).

By building in this manner, you get a flexible deployment: small sites can be entirely static (perhaps even cached indefinitely on CDN), while more complex ones or ones requiring real-time updates can be served via SSR. The architecture will support both without fundamental changes.

Notably, Vercel’s multi-tenant example shows that a single codebase can scale to many tenants with subdomain routing, using a centralized data store ￼. This is a proven approach and can simplify things if you choose to consolidate. On the other hand, separating outputs per site gives you independence and possibly simpler mental model per site. You can even mix: serve most sites via static files, but for a few special cases you could spin up an SSR instance (for example, a client on a higher tier could get SSR if they need dynamic features – you could charge for that).

Scalability & Future Enhancements

With the core architecture in place, we need to ensure the platform can scale and evolve to support more features, more users, and business needs like subscription billing and plan-based feature sets. This section covers how to add subscriptions (Stripe integration), tiered plans, a template/theming system, and other considerations for scaling in terms of performance and maintainability.

1. Subscription Billing (Stripe Integration):
To monetize the platform, integrate a billing system:
	•	Stripe Setup: Create products and pricing plans in Stripe that correspond to your platform’s subscription tiers (for example, “Free”, “Pro”, “Enterprise” with different feature allowances). Use Stripe’s subscription APIs to handle recurring billing. Typically, each client (or site) will have an associated Stripe Customer and Subscription. When you onboard a new client, you either start them on a free tier (no credit card needed initially), or during signup you collect payment info and start a subscription for a paid tier.
	•	Backend Integration: Your backend should store relevant Stripe IDs: e.g., each Site or Account record in your DB could have stripeCustomerId and stripeSubscriptionId fields. This links your records to Stripe’s system. Stripe will send webhooks for events like successful payment, failed payment, subscription canceled, etc. You should set up a webhook endpoint (e.g., /webhook/stripe) that Stripe calls, and update your database accordingly – e.g., if a subscription is past due or canceled, mark the site as inactive or downgrade features.
	•	Entitlements & Features: Based on the subscription plan, enable or disable features (this is often called entitlements). For instance, Free plan might be limited to 5 pages, no custom domain; Pro plan gets custom domain and 50 pages; Enterprise gets multiple users, etc. You can store the plan tier in the Site or User record (like site.plan = 'Pro'). Additionally, you might have a config in core that defines what each plan includes (so the code can check, e.g., if(site.plan.allowsCustomDomain) {...}).
	•	Stripe Customer Portal: To reduce your own dev effort, you can use Stripe’s hosted customer portal for subscription management (so clients can update card details, switch plans, cancel, etc., without you building all that UI). You’d provide a link in the client-admin like “Manage Billing” that opens the Stripe portal for that customer.
	•	Admin Side: Your super-admin panel should have an overview of each site’s plan and payment status. Possibly integrate Stripe’s API to list invoices or see who’s active vs canceled. You might also manually upgrade/downgrade a site’s plan from admin if needed (or grant free trials, etc.).

2. Plan-Based Feature Restrictions:
Once plans are in place, enforce the limitations in both frontend and backend:
	•	Backend Enforcement: Use middleware or checks to enforce quotas. For example, if a site is on Free plan and is attempting to create a 6th page (exceeding limit 5), the backend API for creating a page should respond with an error or a message like “Upgrade required to add more pages.” Similarly, if the plan doesn’t allow e-commerce, the API endpoints related to store products could be disabled, etc.
	•	Frontend UX: The client-admin UI can also check the plan and provide visual cues/upsells. For example, if on free plan, maybe the “Add page” button is disabled after 5 pages with a tooltip “Upgrade to Pro to add more pages.” This requires the frontend to be aware of the plan limits (you can fetch the plan info as part of the user’s site data on login).
	•	Role and Multi-site Consideration: If you ever introduce multi-site bundles (like an account that can have multiple sites under one subscription), you might treat the account (user) as the billing entity rather than each site. But initially it sounds like each site is an independent entity likely with its own subscription. (If one client user has two sites, possibly they pay separately for each, unless you decide to allow a bundle plan. This is a business decision.)
	•	Stripe Entitlements: Stripe recently introduced an Entitlements feature to manage feature access systematically ￼. You could leverage that or keep it simple with your own logic. A simple approach is a config object in your code or database that lists features per plan.

3. Template/Theming System:
To accelerate site creation and cater to non-designers, a template system is invaluable:
	•	Site Templates: Have a set of pre-designed site templates (for example, “Restaurant Template”, “Portfolio Template”, “Blog Template”). Each template would consist of a collection of page layouts and styles. When creating a new site, the super-admin (or eventually the client themselves, if you automate sign-up) can choose one of these templates. The system would then provision the new site with some default pages and content based on that template. For instance, the Restaurant Template might create a Home, Menu, Contact page with placeholder images/text that the client can then replace.
	•	To implement this, you might store template definitions as JSON or even as seed records in the database. A template could be a set of page objects and maybe a theme (colors/fonts).
	•	Theme / Style Customization: Allow each site to have a theme configuration. This can be as simple as setting primary color, secondary color, font choices, and maybe logo. These values can be stored in the Site settings. Template components in core can use these values to render appropriately (e.g., the HeroBanner component picks up the site’s primary color for the background, etc.). This way, even if two clients use the same template, they can make their site look distinct by customizing style properties.
	•	Block Templates: Beyond full-site templates, consider a library of pre-designed blocks/sections. Clients can insert a pre-made section (e.g., a Pricing table section or Testimonials carousel) into a page. This is somewhat akin to Wix or Squarespace where you have section templates. You can maintain these in core and allow drag-drop into pages. This increases the flexibility of site design without the user needing to style from scratch.
	•	Template Marketplace (Future): Down the line, you might open up the system for external designers to create templates or themes. This could be an additional growth avenue (like Webflow has templates marketplace). Keep this in mind by designing templates in a modular way (maybe each template is just data + some overriding styles, not hard-coded deeply in logic).

4. Scaling Infrastructure:
As the number of sites and users grows, you need to ensure the system remains performant and reliable:
	•	Database Scaling: If using a single database for all tenants, monitor performance. Use indexing on siteId for all content queries. This way, even if you have thousands of pages across all sites, queries scoped to one site are fast. If one day the data grows huge (say you have one million sites), you might consider partitioning the database by site ranges or moving to a cluster. A common approach is to use separate schemas or databases per tenant when each tenant is large (this is more relevant for enterprise or data-critical scenarios) ￼. You could design an option where each site has its own MongoDB database or its own schema in PostgreSQL, and the super-admin DB keeps track of connection info for each. This was hinted in the dev.to guide where a super admin DB tracks tenants and their DB URIs ￼. However, this adds complexity in code (the backend needs to dynamically connect to different DBs per request). It might not be necessary unless you have a very high scale or specific isolation requirements. Start with one DB, and perhaps plan to use something that can handle multi-tenant loads (PostgreSQL can handle many rows if indexed properly, or a cluster like MongoDB Atlas can scale horizontally).
	•	Backend Scaling: Since we use stateless JWT auth, scaling the API horizontally is straightforward – you can run multiple instances behind a load balancer to handle more traffic. Ensure the backend is stateless (no in-memory user sessions; if you need caching, use an external store like Redis). For file storage, use a centralized store (disk or cloud storage) that all instances can access.
	•	You might containerize the apps with Docker for deployment, making it easier to scale on cloud providers.
	•	Frontend Scaling: The admin and client-admin being SPAs can be hosted on a CDN or static host (since they are just static JS bundles after build). So they naturally scale – just ensure they are build-optimized (tree-shaking, code splitting as needed).
	•	Site Delivery: If static, use a CDN to serve sites – that scales essentially infinitely for reads. If SSR, ensure to enable caching where possible (e.g., use Varnish or Next.js incremental static regeneration) to avoid rendering on every request for unchanged pages.
	•	Monitoring & Logging: Introduce monitoring early so you can see performance bottlenecks and errors. Use something like logging each request with siteId (so you can see if one site is causing errors or high load). Tools like New Relic, DataDog, or even simple logging to file/DB for admin review can help.
	•	Auto-Scaling: If hosted on cloud (AWS, etc.), consider auto-scaling rules for the API server group if traffic spikes. Similarly, ensure the database can scale (if using managed DB like AWS RDS or Mongo Atlas, you can scale vertically or add read replicas if needed).
	•	Rate Limiting: Implement basic rate limiting on the API per IP or per site to prevent abuse (especially if open Internet-facing).
	•	Backups: Regularly back up the database (so clients don’t lose content) and possibly provide a way to export a site (content + media) for safety. For media, maybe use versioned storage or backups too.

5. Additional Features & Notes (beyond initial requirements):
	•	Multi-language Support: You might want to allow multi-lingual sites in the future. This would affect content structure (pages might have translations). If targeting international clients or markets, plan how to incorporate locale in page data. Perhaps not a priority initially, but worth keeping in mind if your clients might ask for it.
	•	White-label/Admin Branding: If you plan to let agencies use this platform for their clients, you might allow some white-labeling (their logo on the client-admin, etc.). Not an immediate need, but the architecture (separating admin frontends) could facilitate a white-label client-admin variant if needed (like a custom build for a high-tier customer).
	•	API for Developers: In the future, a public API or developer platform might be an idea (like allowing developers to create custom widgets or integrate with the CMS). This would involve exposing secure endpoints and possibly an app/plugin system. For now, focusing on core features is key, but using a standard approach (like REST/JSON now, maybe GraphQL later) can lay groundwork.
	•	Analytics for Clients: Clients will ask “how many people visited my site?”. Implementing basic analytics integration is valuable. E.g., allow them to paste a Google Analytics tracking ID in their settings, and your template injects the GA script on their pages. Or provide a native analytics dashboard (could be as simple as page view counts stored in your db, or integrating an analytics service). Initially, probably just let them use Google Analytics or similar by adding the script.
	•	Editor Enhancements: Over time, the client-admin could evolve to a full visual editor (like Webflow’s Designer). This is a significant project in itself. You might start with simpler form-based editing (like a list of pages and a form to edit each section’s text/image). But keep the structure such that it could be upgraded. Using React for the client-admin is good – one day you could incorporate a drag-drop canvas using the same React components as the site, rendering in an iframe or a design surface.
	•	File Storage & CDN: If many images and media are uploaded, consider using a CDN or optimized storage. You could integrate with services like Cloudinary for image optimization on the fly, or at least ensure to generate various sizes if needed. This is part of performance scaling and also a selling point (fast-loading sites).
	•	Security: Each site should be isolated, but also think about general security: protect against XSS in content (if clients can add custom HTML, sanitize it), protect the admin endpoints from unauthorized access (which we covered with auth), use HTTPS everywhere (especially since sites will be on custom domains – use Let’s Encrypt for those).
	•	DevOps & CI/CD: Set up a CI pipeline to run tests and deploy quickly. Perhaps use something like GitHub Actions or GitLab CI to lint/test on each commit. Given multiple apps, you can configure CI to only build/deploy what changed (Turborepo can help with that logic). For deployment, you could adopt a container approach (Docker images for backend and maybe a separate one for a Next app if you go that route) and orchestrate with Docker Compose or Kubernetes when scaling up.
	•	Testing: As the platform grows, have a strategy for testing. Unit test core logic (in core package), maybe integration tests for API endpoints (ensuring auth works, etc.), and eventually some end-to-end tests for the UI if possible (perhaps using Playwright or Cypress to simulate a user editing a site and publishing).

In terms of solutions and practices from “typical teams and expert companies”, much of the above aligns with how professional SaaS platforms approach these problems:

	•	They use multi-tenant architecture to serve many customers from one codebase while isolating data ￼.
	•	They implement role-based access control so that a super-admin can manage everything and tenants are contained ￼.
	•	They leverage modular design and reusable components for efficiency ￼ (our core/templates approach).
	•	They integrate robust billing systems (Stripe) to monetize effectively.
	•	They plan for scalability and monitoring from day one to ensure the service remains reliable as it grows.

Finally, consider providing a starter scaffold (perhaps open-sourced on GitHub or just internally) that includes this basic structure. You might use a tool like create-turbo to set up the monorepo, or manually set it up following Turborepo guides ￼. Include scripts in the repository for common tasks (e.g., “create-site” script to scaffold a new site directory, “dev” script to run all, “build” script to build all packages). Over time, this scaffold can evolve into a robust codebase.

By implementing the above, you will have a scalable, maintainable foundation for your CMS platform. It will be organized, with clear separation of the core logic, backend, admin UIs, and client sites. Each part can be worked on independently (for example, you could even have separate teams in the future – one team managing the editor frontends, another managing the backend and core, etc., which the monorepo setup will facilitate while still keeping everything in sync).

This comprehensive setup ensures you can support your clients (with a great editing experience and reliable site hosting), and also support your business model (with subscriptions, tiered features, and growth potential). As you continue development, keep documentation up-to-date (for folder structure, deployment steps, etc.) and gather feedback from real usage to iteratively improve performance and features. Good luck building your platform!

Sources: The architecture and approaches above are informed by best practices in multi-tenant SaaS development and examples from industry:
	•	Multi-tenant separation of data and RBAC for admin vs tenants ￼ ￼
	•	Monorepo organization using PNPM/Turborepo for multiple apps (admin, client, etc.) ￼ ￼
	•	Vercel’s example of multi-tenant platform (subdomain routing, shared components, admin interface) ￼ ￼
	•	Guidance on modular design and reusable templates for easy maintenance across sites ￼

### Запуск минимального примера kyanchir
1. `pnpm install`
2. `pnpm dev` и открыть http://localhost:4000
   - Скрипт `predev:ui` теперь очищает не только каталог `packages/ui/dist`, но и файл
     `packages/ui/tsconfig.tsbuildinfo`, чтобы TypeScript точно пересобрал библиотеку UI
     перед запуском сервера.

   - Конфигурация Tailwind (`apps/kyanchir/tailwind.config.cjs`) содержит
     `safelist` с классом `text-brand-lilac` (на уровне корня конфига), поэтому
     при изменениях в компонентах UI цветовые классы всегда попадают в итоговый
     `styles.css`.


   - Конфигурация Tailwind (`apps/kyanchir/tailwind.config.cjs`) содержит
     `safelist` с классом `text-brand-lilac`, поэтому при изменениях в
     компонентах UI цвета корректно попадают в итоговый `styles.css`.



