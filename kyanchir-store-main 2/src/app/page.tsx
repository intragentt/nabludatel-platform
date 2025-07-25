// Местоположение: src/app/page.tsx
import HeroSection from '@/components/HeroSection';
import CatalogContent from '@/components/CatalogContent';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* 
        Просто контейнер для CatalogContent. 
        Больше никакой логики скролла здесь нет.
        Обрати внимание: мы больше не передаем onScrollRequest.
      */}
      <div className="bg-white">
        <CatalogContent />
      </div>
    </>
  );
}
