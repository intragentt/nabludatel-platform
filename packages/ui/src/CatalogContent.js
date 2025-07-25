import { jsx as _jsx } from "react/jsx-runtime";
import ProductCard from "./ProductCard";
export default function CatalogContent({ products }) {
    // Удаляем всю логику с fetch, useEffect, useState для загрузки продуктов.
    // Она больше не нужна здесь.
    return (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: products.map((product) => (_jsx(ProductCard, { product: product }, product.id))) }));
}
