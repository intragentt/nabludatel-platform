export function printStartup(name: string, lastUpdated: string, version: string) {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 ${name.toUpperCase()} ЗАПУЩЕН`);
  console.log(`🕒 Последнее обновление:  ${lastUpdated}`);
  console.log(`🧪 Версия билда:          v${version}`);
  console.log("=".repeat(60) + "\n");
}
