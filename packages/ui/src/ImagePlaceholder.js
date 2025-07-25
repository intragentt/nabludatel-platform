import { jsx as _jsx } from "react/jsx-runtime";
import ShortLogo from "./icons/ShortLogo";
export default function ImagePlaceholder() {
    return (_jsx("div", { className: "absolute inset-0 flex items-center justify-center rounded-md bg-gray-100 backdrop-blur-sm transition-opacity delay-120 duration-500 ease-in-out", children: _jsx(ShortLogo, { className: "h-10 w-auto text-gray-200 opacity-100" }) }));
}
