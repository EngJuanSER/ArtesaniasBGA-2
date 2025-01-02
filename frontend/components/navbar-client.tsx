"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "@/components/menu-list";
import ItemsMenuMobile from "@/components/items-menu-mobile";
import ToggleTheme from "./toggle-theme";
import UserMenu from "./user-menu";

interface NavbarClientProps {
  user: any | null;
  cartItemsCount: number;
  wishItemsCount: number;
}

const NavbarActions = ({ user, cartItemsCount, wishItemsCount }: { user: any | null, cartItemsCount: number, wishItemsCount: number }) => {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-7">
      <div className="relative">
        <ShoppingCart
          strokeWidth={1}
          className="cursor-pointer text-primary transition-colors duration-200 hover:text-white"
          onClick={() => router.push("/cart")}
          aria-label="Carrito de Compras"
        />
        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {cartItemsCount}
          </span>
        )}
      </div>
      <div className="relative">
        <Heart
          strokeWidth={1}
          className="cursor-pointer text-primary transition-colors duration-200 hover:text-white"
          onClick={() => router.push("/wishlist")}
          aria-label="Lista de Deseos"
        />
        {wishItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {wishItemsCount}
          </span>
        )}
      </div>
      <UserMenu user={user} />
      <ToggleTheme />
    </div>
  );
};

export default function NavbarClient({ user, cartItemsCount, wishItemsCount }: NavbarClientProps) {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/60">

      <div className="flex items-center justify-between p-4 mx-auto sm:max-w-4xl md:max-w-6xl">
        <h1
          className="text-3xl cursor-pointer text-primary hover:text-white transition-colors duration-100"
          onClick={() => router.push("/")}
          aria-label="Inicio"
        >
          {"ArtesaniasBGA".split("").map((char, index) => (
            <span
              key={index}
              className="inline-block transition-colors duration-100"
              style={{ transitionDelay: `${index * 35}ms` }}
            >
              {char}
            </span>
          ))}
        </h1>
        <div className="items-center justify-between hidden sm:flex">
          <MenuList />
        </div>
        <div className="flex sm:hidden text-primary hover:text-primary">
          <ItemsMenuMobile />
        </div>
        <NavbarActions user={user} cartItemsCount={cartItemsCount} wishItemsCount={wishItemsCount}/>
        </div>
    </nav>
  );
}