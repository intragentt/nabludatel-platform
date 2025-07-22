import React from "react";

export default function ShortLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="45"
      height="51"
      viewBox="0 0 45 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_30_622)">{/* ... SVG path ... */}</g>
      <defs>
        <clipPath id="clip0_30_622">
          <rect width="45" height="51" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
ShortLogo.displayName = "ShortLogo";
