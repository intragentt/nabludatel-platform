// packages/ui/src/Header.tsx

import React from "react";
import Logo from "./icons/Logo";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white">
        {/* 
          "РАБОЧАЯ ОБЛАСТЬ" (Точно по ТЗ):
          - h-[65px]: Строгая высота.
          - px-[15px]: Отступы по бокам 15px.
          - flex items-center: Выравнивает все внутри по вертикали.
        */}
        <div className="mx-auto flex h-[65px] items-center px-[15px]">
          <a href="/">
            {/* 
              ЛОГОТИП (Точно по ТЗ):
              - h-[30px]: Высота логотипа 30px.
              - w-auto: Ширина подстраивается автоматически.
              - text-brand-primary: Фирменный сиреневый цвет.
            */}
            <Logo className="h-[30px] w-auto text-brand-primary" />
          </a>
        </div>
      </header>

      {/* Распорка той же высоты */}
      <div className="h-[65px]" />
    </>
  );
}
