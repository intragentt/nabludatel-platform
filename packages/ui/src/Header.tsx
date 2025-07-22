// Местоположение: src/components/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Logo from "./icons/Logo";
import CloseIcon from "./icons/CloseIcon";
import BurgerIcon from "./icons/BurgerIcon";
import SearchIcon from "./icons/SearchIcon";
import CartIcon from "./icons/CartIcon";
import DesktopNav from "./header/DesktopNav";
import MobileNav from "./header/MobileNav";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    }
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-152 w-full border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
          {!isSearchActive && (
            <a
              href="/"
              onClick={() => {
                setIsMenuOpen(false);
              }}
              aria-label="На главную"
              className="-mt-1"
            >
              <Logo className="logo-brand-color h-[10px] w-auto" />
            </a>
          )}

          <div className="hidden items-center space-x-6 lg:flex">
            <DesktopNav />
          </div>

          <div className="flex items-center space-x-2 lg:hidden">
            {isSearchActive ? (
              <>
                <SearchIcon className="mr-2 h-6 w-6 text-gray-700" />
                <input
                  type="search"
                  className="flex-grow border-b border-gray-300 focus:outline-none"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchActive(false);
                    setSearchQuery("");
                  }}
                  className="ml-2 text-sm text-gray-600"
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsSearchActive(true)}
                  aria-label="Поиск"
                  className="relative z-50 p-2 text-gray-700"
                >
                  <SearchIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative z-50 mt-[1px] p-[2px] text-gray-700"
                >
                  {isMenuOpen ? (
                    <CloseIcon className="h-7 w-7" />
                  ) : (
                    <BurgerIcon className="h-7 w-7" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="h-[65px]" aria-hidden="true" />

      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
