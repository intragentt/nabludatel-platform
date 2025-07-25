import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Местоположение: src/components/ProductCard.tsx
import { formatPrice } from "./utils/formatPrice";
import ImagePlaceholder from "./ImagePlaceholder";
import HeartIcon from "./icons/HeartIcon";
export default function ProductCard({ product }) {
    const img1Error = false;
    const img2Error = false;
    const imageUrl1 = product.imageUrls?.[0];
    const imageUrl2 = product.imageUrls?.[1];
    const hasDiscount = product.oldPrice && product.oldPrice > 0;
    const currentPrice = formatPrice(product.price);
    const oldPrice = hasDiscount
        ? formatPrice(product.oldPrice)
        : null;
    return (_jsxs("a", { href: `/product/${product.id}`, className: "group text-text-primary mx-auto flex w-full flex-col md:max-w-[330px]", children: [_jsxs("div", { className: "relative z-10 grid grid-cols-2 gap-x-2.5", children: [_jsxs("div", { className: "relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200", children: [_jsx(ImagePlaceholder, {}), imageUrl1 && !img1Error && (_jsx("img", { src: imageUrl1, alt: `${product.name} - фото 1`, className: "object-cover absolute inset-0 w-full h-full", onError: () => { } }))] }), _jsxs("div", { className: "relative aspect-[3/4] w-full overflow-hidden rounded-md border border-gray-200", children: [_jsx(ImagePlaceholder, {}), imageUrl2 && !img2Error && (_jsx("img", { src: imageUrl2, alt: `${product.name} - фото 2`, className: "object-cover absolute inset-0 w-full h-full", onError: () => { } }))] })] }), _jsxs("div", { className: "relative z-0 mx-auto mt-[-12px] flex w-[calc(100%-10px)] flex-grow flex-col justify-between rounded-b-md border-x border-b border-gray-200 bg-white px-3 pt-5 pb-2", children: [_jsxs("div", { children: [_jsx("div", { className: "font-body text-text-primary mt-0.5 text-base font-semibold", children: product.name }), _jsx("div", { className: "mt-1 flex items-baseline justify-between", children: _jsxs("div", { className: "flex items-baseline gap-x-2", children: [currentPrice && (_jsx("p", { className: "font-body text-text-primary text-base font-semibold", children: `${currentPrice.value} ${currentPrice.currency}` })), hasDiscount && oldPrice && (_jsxs("p", { className: "font-body text-base font-semibold text-gray-400", children: [_jsx("span", { className: "line-through", children: oldPrice.value }), _jsxs("span", { children: [" ", oldPrice.currency] })] }))] }) })] }), _jsx("div", { className: "absolute right-1 bottom-1 overflow-visible sm:right-2 sm:bottom-2", children: _jsx(HeartIcon, { className: "h-6 w-6 text-gray-400" }) })] })] }));
}
