// Местоположение: src/app/catalog/page.tsx
// Это страница каталога товаров (Server Component).

import CatalogContent from '@/components/CatalogContent'; // Импортируем наш новый Client Component

export default async function CatalogPage() {
  // Поскольку вся логика состояния перенесена в CatalogContent,
  // здесь мы можем убрать await new Promise...
  // Если у тебя есть настоящая асинхронная загрузка *перед* рендером Client Component,
  // она может остаться тут, но для useState она не нужна.
  
  return (
    // Просто рендерим CatalogContent. Вся интерактивность внутри него.
    <CatalogContent />
  );
}