// Местоположение: src/components/CatalogContent.tsx
'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';
import ProductCard from '@/components/ProductCard';
import SmartStickyCategoryFilter from '@/components/SmartStickyCategoryFilter';
import { Product } from '@/app/api/products/route';
import ShortLogo from '@/components/icons/ShortLogo';

const HEADER_HEIGHT = 65;

export default function CatalogContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const filterContainerRef = useRef<HTMLDivElement>(null);
  const productGridRef = useRef<HTMLDivElement>(null);

  // --- НОВАЯ ЛОГИКА ---
  // Состояние для хранения ВЕРХНЕЙ границы прелоадера
  const [preloaderTop, setPreloaderTop] = useState(0);

  // Этот эффект будет вычислять, где должен начинаться прелоадер
  useLayoutEffect(() => {
    if (filterContainerRef.current) {
      const bottomOfFilter =
        filterContainerRef.current.getBoundingClientRect().bottom;
      // Мы не хотим, чтобы прелоадер появлялся выше шапки, если фильтр скрыт
      setPreloaderTop(Math.max(bottomOfFilter, HEADER_HEIGHT));
    }
  }, [isLoading, filteredProducts]); // Пересчитываем позицию при каждом обновлении

  const applyFilter = useCallback((products: Product[], categoryId: string) => {
    if (categoryId === 'all') setFilteredProducts(products);
    else {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFilteredProducts(shuffled.slice(0, 5));
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Ошибка сети');
        const data: Product[] = await response.json();
        setAllProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    fetchProducts();
  }, [applyFilter]);

  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      if (activeCategory === categoryId) return;
      setIsLoading(true);
      if (filterContainerRef.current) {
        const topOfContent =
          filterContainerRef.current.getBoundingClientRect().top +
          window.scrollY;
        const destination = topOfContent - HEADER_HEIGHT;
        window.scrollTo({ top: destination, behavior: 'auto' });
      }
      setActiveCategory(categoryId);
      setTimeout(() => {
        applyFilter(allProducts, categoryId);
        setTimeout(() => {
          setIsLoading(false);
        }, 150); // 150 мс задержка
      }, 50);
    },
    [activeCategory, allProducts, applyFilter],
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* 
        ФИНАЛЬНЫЙ ПРЕЛОАДЕР
        Появляется только при смене категории и позиционируется идеально.
      */}
      {isLoading && !isInitialLoad && (
        <div
          className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-white backdrop-blur-sm"
          style={{ top: `${preloaderTop}px` }}
        >
          <ShortLogo className="animate-fade-pulse h-12 w-12 text-gray-200" />
        </div>
      )}

      <div ref={filterContainerRef}>
        <SmartStickyCategoryFilter
          onSelectCategory={handleSelectCategory}
          initialCategory={activeCategory}
          className="mb-10"
          workZoneRef={productGridRef}
        />
      </div>
      <div ref={productGridRef} className="relative">
        {/* Контент становится невидимым, а не полупрозрачным */}
        <div
          className={`grid grid-cols-1 gap-x-4 gap-y-10 transition-opacity duration-300 sm:gap-x-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 xl:max-w-7xl xl:grid-cols-4 xl:gap-x-10 2xl:mx-auto 2xl:max-w-[1600px] ${isLoading && !isInitialLoad ? 'opacity-0' : 'opacity-100'}`}
        >
          {filteredProducts.map((product) =>
            product && product.id ? (
              <ProductCard key={product.id} product={product} />
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
