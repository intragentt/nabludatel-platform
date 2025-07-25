import React from "react";
import ShortLogo from "./icons/ShortLogo";

export default function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-md bg-gray-100 backdrop-blur-sm transition-opacity delay-120 duration-500 ease-in-out">
      <ShortLogo className="h-10 w-auto text-gray-200 opacity-100" />
    </div>
  );
}
