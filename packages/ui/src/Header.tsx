import React from "react";
import Logo from "./icons/Logo";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-[72px] border-b border-gray-200 bg-gray-100 shadow-md">
        {/* 
          "РАБОЧАЯ ОБЛАСТЬ":
          - h-[72px]: высота шапки
          - pl-[10px]: отступ слева
          - flex items-center: вертикальное выравнивание
        */}
        <div className="flex items-center pl-[10px]">
          <a href="/">
            {/* 
              ЛОГОТИП:
              - h-[30px]: высота SVG
              - w-[100px]: ширина SVG
              - text-brand-primary: цвет логотипа
            */}
            <Logo className="text-brand-primary h-[30px] w-auto" />
          </a>
        </div>
      </header>
      {/* Отступ для контента, чтобы учесть высоту шапки */}
      <div className="h-[72px] bg-gray-100" />
    </>
  );
}
