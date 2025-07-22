import React from "react";
import ProductCard from "./ProductCard";

// Тип Product, возможно, нужно будет вынести в packages/core
interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl1: string;
  // ... другие поля
}

interface CatalogContentProps {
  products: Product[]; // <-- Теперь мы принимаем продукты как props
}

export default function CatalogContent({ products }: CatalogContentProps) {
  // Удаляем всю логику с fetch, useEffect, useState для загрузки продуктов.
  // Она больше не нужна здесь.

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
