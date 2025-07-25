// Местоположение: src/components/HeroSection.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import MiniBannerSlider, { MiniBanner } from './MiniBannerSlider';

const DUMMY_MAIN_BANNERS: MiniBanner[] = [
  {
    id: 'main1',
    imageUrl: '',
    altText: 'Основной баннер 1',
    linkHref: '/catalog',
    title: 'ВЕСЕННЯЯ НЕЖНОСТЬ УЖЕ ЗДЕСЬ!',
    description: 'Откройте новые образы для легких и воздушных дней.',
    bgColor: 'bg-indigo-300',
  },
  {
    id: 'main2',
    imageUrl: '',
    altText: 'Основной баннер 2',
    linkHref: '/new',
    title: 'СКИДКИ ДО 50%!',
    description: 'Успейте приобрести любимые комплекты.',
    bgColor: 'bg-purple-300',
  },
  {
    id: 'main3',
    imageUrl: '',
    altText: 'Основной баннер 3',
    linkHref: '/brands',
    title: 'НОВЫЕ БРЕНДЫ',
    description: 'Погрузитесь в мир стиля и комфорта.',
    bgColor: 'bg-green-300',
  },
  {
    id: 'main4',
    imageUrl: '',
    altText: 'Основной баннер 4',
    linkHref: '/sales',
    title: 'ФИНАЛЬНАЯ РАСПРОДАЖА',
    description: 'Последний шанс забрать лучшее.',
    bgColor: 'bg-red-300',
  },
];

const TEXT_BLOCKS = [
  {
    title: "Новая коллекция 'Aura'",
    description:
      'Почувствуйте легкость и свежесть с нашими новыми моделями из натуральных тканей.',
  },
  {
    title: 'Горячие скидки',
    description:
      'Не упустите выгоду! Лучшие предложения на популярные товары уже здесь.',
  },
  {
    title: 'Знакомство с брендами',
    description:
      'Мы собрали для вас лучшие бренды, чтобы вы могли найти свой уникальный стиль.',
  },
  {
    title: 'Последний шанс',
    description:
      'Товары, которые скоро закончатся. Успейте добавить в корзину!',
  },
];

export default function HeroSection() {
  const [currentWidth, setCurrentWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setCurrentWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleSlideChange = (index: number) => {
    setActiveIndex(index);
  };

  const isDesktop = currentWidth >= 1024;

  const getAspectRatio = useCallback((width: number): string => {
    if (width >= 1280) {
      return 'aspect-[21/9]';
    }
    if (width >= 1024) {
      return 'aspect-[16/9]';
    }
    if (width >= 768) {
      return 'aspect-[1/1]';
    }
    return 'aspect-[4/5]';
  }, []);

  const mainBannerAspectRatio = getAspectRatio(currentWidth);

  const mobileTabletSwiperSettings = {
    slidesPerView: 'auto' as const,
    spaceBetween: 0,
    pagination: true,
  };

  const desktopSwiperSettings = {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: true,
  };

  return (
    <div className="w-full pb-4 sm:pb-6 lg:pb-8">
      {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ: Добавляем overflow-x-hidden --- */}
      <div className="w-full overflow-x-hidden">
        <MiniBannerSlider
          key={isDesktop ? 'desktop' : 'mobile'}
          banners={DUMMY_MAIN_BANNERS}
          autoplayDelay={5000}
          aspectRatioClass={mainBannerAspectRatio}
          swiperSettings={
            isDesktop ? desktopSwiperSettings : mobileTabletSwiperSettings
          }
          isDebugMode={true}
          onSlideChange={handleSlideChange}
          activeIndex={activeIndex}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mt-6 flex min-h-[72px] flex-col items-center justify-center text-center">
          <h2 className="font-body text-text-primary text-base font-semibold">
            {TEXT_BLOCKS[activeIndex]?.title || 'Вдохновение для вашего стиля'}
          </h2>
          <p className="font-body text-body-sm mx-auto mt-1 max-w-xl text-gray-500">
            {TEXT_BLOCKS[activeIndex]?.description ||
              'Найдите идеальное сочетание качества, красоты и неповторимого стиля в наших коллекциях.'}
          </p>
        </div>
      </div>
    </div>
  );
}
