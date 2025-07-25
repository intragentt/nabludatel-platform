// Местоположение: src/components/ProductCard.tsx
import React from "react";
import { formatPrice, PriceParts } from "./utils/formatPrice";
import ImagePlaceholder from "./ImagePlaceholder";
import HeartIcon from "./icons/HeartIcon";

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrls?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const img1Error = false;
  const img2Error = false;

  const imageUrl1 = product.imageUrls?.[0];
  const imageUrl2 = product.imageUrls?.[1];

  const hasDiscount = product.oldPrice && product.oldPrice > 0;
  const currentPrice: PriceParts | null = formatPrice(product.price);
  const oldPrice: PriceParts | null = hasDiscount
    ? formatPrice(product.oldPrice)
    : null;

  return (
    <a
      href={`/product/${product.id}`}
      className="group text-text-primary mx-auto flex w-full flex-col md:max-w-[330px]"
    >
      <div className="relative z-10 grid grid-cols-2 gap-x-2.5">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200">
          <ImagePlaceholder />
          {imageUrl1 && !img1Error && (
            <img
              src={imageUrl1}
              alt={`${product.name} - фото 1`}
              className="object-cover absolute inset-0 w-full h-full"
              onError={() => {}}
            />
          )}
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200">
          <ImagePlaceholder />
          {imageUrl2 && !img2Error && (
            <img
              src={imageUrl2}
              alt={`${product.name} - фото 2`}
              className="object-cover absolute inset-0 w-full h-full"
              onError={() => {}}
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
          <HeartIcon className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </a>
  );
}
