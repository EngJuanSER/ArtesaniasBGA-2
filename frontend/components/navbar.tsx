"use client"
import { Heart, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuList from "@/components/menu-list";
import ItemsMenuMobile from "@/components/items-menu-mobile";
import ToggleTheme from "./toggle-theme";

const Navbar = () => {
    const router = useRouter()

    return (
        <nav className="flex items-center justify-between p-4 mx-auto sm:max-w-4xl md:max-w-6xl">
            <h1 
                className="text-3xl cursor-pointer text-primary hover:text-white  transition-colors duration-100" 
                onMouseEnter={() => {}}
                onClick={() => router.push("/")}
                aria-label="Inicio"
            >
                { "Artesanías".split("").map((char, index) => (
                    <span 
                        key={index} 
                        className="inline-block transition-colors duration-100"
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        {char}
                    </span>
                )) }
                <span className="font-bold">
                    { "BGA".split("").map((char, index) => (
                        <span 
                            key={index} 
                            className="inline-block transition-colors duration-100"
                            style={{ transitionDelay: `${"Artesanías".length * 50 + index * 50}ms` }}
                        >
                            {char}
                        </span>
                    )) }
                </span>
            </h1>
            
            <div className="items-center justify-between hidden sm:flex">
                <MenuList />
            </div>
            <div className="flex sm:hidden text-primary hover:text-primary">
                <ItemsMenuMobile />
            </div>
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
                    className="cursor-pointer text-primary transition-colors duration-200 hover:text-white " 
                    onClick={() => router.push("/profile")}
                    aria-label="Perfil de Usuario"
                />

                <ToggleTheme />
            </div>
        </nav>
    );
}

export default Navbar;