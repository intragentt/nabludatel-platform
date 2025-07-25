// packages/ui/src/Header.tsx

import React from "react";
import Logo from "./icons/Logo";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white">
        {/* 
          "РАБОЧАЯ ОБЛАСТЬ" (Точно по ТЗ):
          - h-[72px]: Строгая высота для мобильного вида.
          - pl-[10px]: Отступ слева 10px.
          - flex items-center: Выравнивает все внутри по вертикали.
        */}
        <div className="flex h-[72px] items-center pl-[10px]">
          <a href="/">
            {/* 
              ЛОГОТИП (Точно по ТЗ):
              - h-[30px]: Высота логотипа 30px.
              - w-[100px]: Фиксированная ширина около 100px.
              - text-brand-primary: Фирменный сиреневый цвет.
            */}
            <Logo className="h-[30px] w-[100px] text-brand-primary" />
          </a>
        </div>
      </header>

      {/* Распорка той же высоты */}
      <div className="h-[72px]" />
    </>
  );
}
