export function printServerStop(name: string, lastUpdated: string, version: string) {
  console.log("\n" + "=".repeat(60));
  console.log(`🛑 Сервер ${name.toUpperCase()} остановлен.`);
  console.log(`🕒 Последнее обновление:  ${lastUpdated}`);
  console.log(`🧪 Версия билда:          v${version}`);
  console.log("=".repeat(60) + "\n");
}
