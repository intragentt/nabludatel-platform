// Местоположение: src/components/Header.tsx
import React from "react";
import Logo from "./icons/Logo";
import DesktopNav from "./header/DesktopNav";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-152 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
          <a href="/" aria-label="На главную" className="-mt-1">
            <Logo className="logo-brand-color h-[10px] w-auto" />
          </a>

          <div className="hidden items-center space-x-6 lg:flex">
            <DesktopNav />
          </div>
        </div>
      </header>

      <div className="h-[65px]" aria-hidden="true" />
    </>
  );
}
