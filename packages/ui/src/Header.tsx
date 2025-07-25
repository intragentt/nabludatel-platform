import React from "react";
import Logo from "./icons/Logo";
import BurgerIcon from "./icons/BurgerIcon";
import CloseIcon from "./icons/CloseIcon";
import { NAV_LINKS } from "./config/navigation";

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-gray-100 shadow-md">
        <div className="mx-auto flex h-[72px] sm:h-[80px] lg:h-[96px] items-center justify-between px-4">
          <a href="/" aria-label="На главную" className="flex-shrink-0">
            <Logo className="h-[30px] w-auto" style={{ color: "var(--color-brand-primary)" }} />
          </a>
          <nav className="hidden lg:flex items-center gap-x-6">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-text-primary hover:text-brand-primary">
                {link.label}
              </a>
            ))}
          </nav>
          <button className="lg:hidden p-2" data-open-menu>
            <BurgerIcon className="h-6 w-6 text-text-primary" />
          </button>
        </div>
      </header>
      <div className="h-[72px] sm:h-[80px] lg:h-[96px] bg-gray-100" />

      <div className="fixed inset-0 z-40 hidden bg-white" data-mobile-menu>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 h-[72px]">
            <Logo className="h-[30px] w-auto" style={{ color: "var(--color-brand-primary)" }} />
            <button className="p-2" data-close-menu>
              <CloseIcon className="h-6 w-6 text-text-primary" />
            </button>
          </div>
          <nav className="flex flex-col items-start px-4 space-y-4 mt-4">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-lg text-text-primary">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(() => {
            var menu = document.querySelector('[data-mobile-menu]');
            var openBtn = document.querySelector('[data-open-menu]');
            var closeBtn = menu && menu.querySelector('[data-close-menu]');
            if (openBtn && menu) {
              openBtn.addEventListener('click', () => menu.classList.remove('hidden'));
            }
            if (closeBtn && menu) {
              closeBtn.addEventListener('click', () => menu.classList.add('hidden'));
            }
          })();`,
        }}
      />
    </>
  );
}
