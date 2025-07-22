import SearchIcon from "../icons/SearchIcon";
import CartIcon from "../icons/CartIcon";
import { NAV_LINKS } from "../config/navigation";

export default function DesktopNav() {
  return (
    <>
      <nav className="flex items-center space-x-6">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-brand-lilac text-lg text-gray-500"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="flex items-center space-x-4">
        <button className="text-text-primary hover:text-brand-lilac p-2">
          <SearchIcon className="h-6 w-6" />
        </button>
        <button className="text-text-primary hover:text-brand-lilac p-2">
          <CartIcon className="h-6 w-6" />
        </button>
      </div>
    </>
  );
}
