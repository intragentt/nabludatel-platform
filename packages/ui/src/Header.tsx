// Файл: /packages/ui/src/Header.tsx

import React from "react";
import Logo from "./icons/Logo.js"; // <-- Важно: .js
// Если эти импорты нужны для Header, но ты не хочешь навигацию, оставь.
// Если нет, можешь закомментировать или удалить:
// import BurgerIcon from "./icons/BurgerIcon.js"; // <-- Важно: .js
// import CloseIcon from "./icons/CloseIcon.js"; // <-- Важно: .js
// import { NAV_LINKS } from "./config/navigation.js"; // <-- Важно: .js

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-full items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
          <a href="/" aria-label="На главную">
            <Logo className="h-8 w-auto text-brand-lilac" />
          </a>
          {/* Навигация и кнопки мобильного меню закомментированы/удалены для минимализма */}
          {/* <nav className="hidden lg:flex items-center gap-x-6">...</nav> */}
          {/* <button className="lg:hidden p-2" data-open-menu>...</button> */}
        </div>
      </header>
      {/* Распорка для фиксированной шапки */}
      <div className="h-[80px]" aria-hidden="true" />
      {/* Скрипт мобильного меню, если был, теперь не нужен без кнопок и самого меню */}
      {/* <script dangerouslySetInnerHTML={{ __html: `...` }} /> */}
    </>
  );
}
