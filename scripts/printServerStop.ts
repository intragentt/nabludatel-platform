function printServerStop(name: string) {
    console.log(`\n🛑 Сервер ${name.toUpperCase()} остановлен вручную (Ctrl+C)`);
  }
  
  module.exports = { printServerStop };