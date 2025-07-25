

# Конфигурация Turborepo (`turbo.json`)

Ниже представлен полный файл `turbo.json` с подробными комментариями, объясняющими, как работает каждая часть конфигурации.

```jsonc
{
  // $schema — ссылка на схему Turborepo для автодополнения и валидации структуры файла.
  // Редакторы, поддерживающие JSON Schema, будут использовать этот URL, чтобы
  // подсказывать допустимые ключи и значения.
  "$schema": "https://turbo.build/schema.json",

  // Раздел "tasks" описывает задачи (pipelines), которые Turborepo может выполнять.
  "tasks": {
    // Задача "build" отвечает за сборку всех пакетов в монорепозитории.
    "build": {
      // dependsOn — список зависимостей: перед выполнением этой задачи
      // автоматически запустятся задачи "build" в зависимых (upstream) пакетах.
      // "^build" означает: взять задачу "build" из всех пакетов, от которых зависит текущий.
      "dependsOn": ["^build"],

      // outputs — маска файлов/папок, которые считаются результатом сборки.
      // Turborepo будет кешировать эти результаты и при повторном запуске
      // пропускать сборку, если артефакты уже существуют и не изменились.
      "outputs": ["dist/**"]
    },

    // Задача "dev" используется для локальной разработки (watch mode).
    "dev": {
      // cache: false — отключаем кэширование для dev-режима, чтобы на каждом
      // старте процесса разработки видеть свежие изменения.
      "cache": false,

      // persistent: true — указывает, что процесс должен оставаться активным
      // (например, dev-сервер), а не завершаться сразу после выполнения.
      "persistent": true,

      // dependsOn: ["^dev"] — перед запуском этой задачи будут запущены все
      // задачи "dev" в зависимых пакетах, чтобы каждый сервис или пакет
      // в монорепозитории запустил свой режим наблюдения (watch).
      "dependsOn": ["^dev"]
    }
  }
}
```

> **Важно:** В данном файле используется синтаксис JSONC (JSON с комментариями `//`),
> который не является валидным чистым JSON. Этот файл служит только для документации.
> Для реального запуска Turborepo используйте чистый `turbo.json` без комментариев.