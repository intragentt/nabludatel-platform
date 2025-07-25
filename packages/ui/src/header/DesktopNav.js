import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import SearchIcon from "../icons/SearchIcon";
import CartIcon from "../icons/CartIcon";
import { NAV_LINKS } from "../config/navigation";
export default function DesktopNav() {
    return (_jsxs(_Fragment, { children: [_jsx("nav", { className: "flex items-center space-x-6", children: NAV_LINKS.map((link) => (_jsx("a", { href: link.href, className: "hover:text-brand-lilac text-lg text-gray-500", children: link.label }, link.href))) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("button", { className: "text-text-primary hover:text-brand-lilac p-2", children: _jsx(SearchIcon, { className: "h-6 w-6" }) }), _jsx("button", { className: "text-text-primary hover:text-brand-lilac p-2", children: _jsx(CartIcon, { className: "h-6 w-6" }) })] })] }));
}
