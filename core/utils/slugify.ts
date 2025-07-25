// Преобразует строку в URL-дружественный slug
export function slugify(text: string): string {
  return text
    .toString() // гарантирует, что это строка
    .toLowerCase() // приводит к нижнему регистру
    .normalize("NFD") // разбивает символы и диакритику (например, é → e + ´)
    .replace(/[\u0300-\u036f]/g, "") // удаляет диакритику (оставляя base-буквы)
    .replace(/\s+/g, "-") // пробелы заменяет на дефисы
    .replace(/[^\w\-]+/g, "") // удаляет все символы, кроме букв, цифр и дефисов
    .replace(/\-\-+/g, "-") // множественные дефисы → один
    .replace(/^-+/, "") // убирает дефисы в начале
    .replace(/-+$/, ""); // убирает дефисы в конце
}
