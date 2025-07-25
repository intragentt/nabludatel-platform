// Это небольшая утилита для получения метаданных о проекте.
// При импорте модуля мы читаем данные из git (автор, ветка и т.д.),
// чтобы отображать их в интерфейсе или логах.
// Импорт информации о репозитории из локального Git
import git from "git-rev-sync";

// Конфигурация проекта — доступна во всей системе
export const project = {
  name: "nabludatel.core", // Название движка/фреймворка
  version: "0.1.0", // Текущая версия проекта
  author: git.author(), // Автор (из Git-конфига)
  commit: git.short(), // Короткий хеш последнего коммита
  branch: git.branch(), // Активная ветка
  lastCommit: git.date(), // Дата последнего коммита

  // Динамические данные — обновляются при каждом импорте
  get buildMeta() {
    return {
      builtAt: new Date().toISOString(), // Время генерации (билда)
      environment: process.env.NODE_ENV || "development", // dev или production
    };
  },
};
