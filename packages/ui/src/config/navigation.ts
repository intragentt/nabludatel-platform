type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Все товары", href: "/catalog" },
  { label: "Новинки", href: "/new" },
  { label: "Бренды", href: "/brands" },
  { label: "О нас", href: "/about" },
  { label: "UI-Кит (Типографика)", href: "/styleguide/typography" },
];
