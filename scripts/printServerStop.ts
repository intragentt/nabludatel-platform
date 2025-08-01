// ============================================================================
// scripts/printServerStop.ts - СКРИПТ ДЛЯ КРАСИВОГО ЗАВЕРШЕНИЯ РАБОТЫ
// ============================================================================

/**
 * Выводит в консоль информационный баннер об остановке сервера.
 * @param name - Имя части проекта (например, "backend" или "admin").
 * @param lastUpdated - Дата последнего обновления (необязательно).
 * @param version - Версия пакета.
 */
export function printServerStop(
  name: string,
  lastUpdated: string | null, // ✅ Вот исправление! Разрешаем null.
  version: string
) {
  console.log("\n" + "=".repeat(60));
  console.log(`🛑 Сервер ${name.toUpperCase()} остановлен.`);
  // Добавляем проверку: выводим строку, только если lastUpdated существует.
  if (lastUpdated) {
    console.log(`🕒 Последнее обновление:  ${lastUpdated}`);
  }
  console.log(`🧪 Версия билда:          v${version}`);
  console.log("=".repeat(60) + "\n");
}
