import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// Местоположение: src/components/Header.tsx
import Logo from "./icons/Logo";
import DesktopNav from "./header/DesktopNav";
export default function Header() {
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "fixed top-0 right-0 left-0 z-152 w-full border-b border-gray-200 bg-white", children: _jsxs("div", { className: "container mx-auto flex h-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-12", children: [_jsx("a", { href: "/", "aria-label": "\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E", className: "-mt-1", children: _jsx(Logo, { className: "logo-brand-color h-[10px] w-auto" }) }), _jsx("div", { className: "hidden items-center space-x-6 lg:flex", children: _jsx(DesktopNav, {}) })] }) }), _jsx("div", { className: "h-[65px]", "aria-hidden": "true" })] }));
}
