// Местоположение: src/components/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Product } from '@/app/api/products/route';
import { formatPrice, PriceParts } from '@/utils/formatPrice';
import ImagePlaceholder from './ImagePlaceholder';
import HeartIcon from './icons/HeartIcon';

interface ProductCardProps {
  product: Product; // Убираем '?', продукт всегда должен быть
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Новый стейт для отслеживания ошибки загрузки картинок
  const [img1Error, setImg1Error] = useState(false);
  const [img2Error, setImg2Error] = useState(false);

  // Логика лайков остается без изменений
  useEffect(() => {
    const savedLiked = localStorage.getItem(`liked-${product.id}`);
    if (savedLiked === 'true') {
      setIsLiked(true);
    }
  }, [product.id]);

  useEffect(() => {
    localStorage.setItem(`liked-${product.id}`, String(isLiked));
  }, [isLiked, product.id]);

  // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
  // Убираем `|| ''`. Теперь, если картинки нет, переменная будет `undefined`.
  const imageUrl1 = product.imageUrls?.[0];
  const imageUrl2 = product.imageUrls?.[1];

  const hasDiscount = product.oldPrice && product.oldPrice > 0;
  const currentPrice: PriceParts | null = formatPrice(product.price);
  const oldPrice: PriceParts | null = hasDiscount
    ? formatPrice(product.oldPrice)
    : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group text-text-primary mx-auto flex w-full flex-col md:max-w-[330px]"
    >
      <div className="relative z-10 grid grid-cols-2 gap-x-2.5">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200">
          <ImagePlaceholder />
          {/* Рендерим Image, только если imageUrl1 есть и не было ошибки загрузки */}
          {imageUrl1 && !img1Error && (
            <Image
              src={imageUrl1}
              alt={`${product.name} - фото 1`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImg1Error(true)}
            />
          )}
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200">
          <ImagePlaceholder />
          {/* Рендерим Image, только если imageUrl2 есть и не было ошибки загрузки */}
          {imageUrl2 && !img2Error && (
            <Image
              src={imageUrl2}
              alt={`${product.name} - фото 2`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImg2Error(true)}
            />
          )}
        </div>
      </div>

      <div className="relative z-0 mx-auto mt-[-12px] flex w-[calc(100%-10px)] flex-grow flex-col justify-between rounded-b-md border-x border-b border-gray-200 bg-white px-3 pt-5 pb-2">
        <div>
          <div className="font-body text-text-primary mt-0.5 text-base font-semibold">
            {product.name}
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="flex items-baseline gap-x-2">
              {currentPrice && (
                <p className="font-body text-text-primary text-base font-semibold">
                  {`${currentPrice.value} ${currentPrice.currency}`}
                </p>
              )}
              {hasDiscount && oldPrice && (
                <p className="font-body text-base font-semibold text-gray-400">
                  <span className="line-through">{oldPrice.value}</span>
                  <span> {oldPrice.currency}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="absolute right-1 bottom-1 overflow-visible sm:right-2 sm:bottom-2">
          <button
            aria-label="Добавить в избранное"
            className="flex h-10 w-10 items-center justify-center transition-all duration-300 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
          >
            <HeartIcon
              filled={isLiked}
              className="h-6 w-6"
              style={{ color: isLiked ? '#D32F2F' : '#272727' }}
            />
          </button>
        </div>
      </div>
    </Link>
  );
}
