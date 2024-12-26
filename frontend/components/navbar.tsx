"use client";

import { Heart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "@/components/menu-list";
import ItemsMenuMobile from "@/components/items-menu-mobile";
import ToggleTheme from "./toggle-theme";
import { getUserMeLoader } from "@/services/userService";


const NavbarActions = () => {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-7">
      <ShoppingCart
        strokeWidth={1}
        className="cursor-pointer text-primary transition-colors duration-200 hover:text-white"
        onClick={() => router.push("/cart")}
        aria-label="Carrito de Compras"
      />
      <Heart
        strokeWidth={1}
        className="cursor-pointer text-primary transition-colors duration-200 hover:text-white"
        onClick={() => router.push("/wishlist")}
        aria-label="Lista de Deseos"
      />
      <User
        strokeWidth={1}
        className="cursor-pointer text-primary transition-colors duration-200 hover:text-white"
        onClick={() => router.push("/signin")}
        aria-label="Perfil de Usuario"
      />
      <ToggleTheme />
    </div>
  );
};

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4 mx-auto sm:max-w-4xl md:max-w-6xl">
        <h1
          className="text-3xl cursor-pointer text-primary hover:text-white transition-colors duration-100"
          onClick={() => router.push("/")}
          aria-label="Inicio"
        >
          ArtesaniasBGA
        </h1>

        <div className="items-center justify-between hidden sm:flex">
          <MenuList />
        </div>
        <div className="flex sm:hidden text-primary hover:text-primary">
          <ItemsMenuMobile />
        </div>
        <NavbarActions />
      </div>
    </nav>
  );
};

export default Navbar;