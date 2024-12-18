import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Menu />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-2">
                <Link href="/shop" className="block">
                    Tienda
                </Link>
                <Link href="/offers" className="block">
                    Ofertas
                </Link>
                <Link href="/category/ceramica" className="block">
                    Cerámica
                </Link>
                <Link href="/category/madera" className="block">
                    Madera
                </Link>
                <Link href="/category/textiles" className="block">
                    Textiles
                </Link>
                <Link href="/category/joyeria" className="block">
                    Joyería
                </Link>
                <Link href="/category/vidrio" className="block">
                    Vidrio
                </Link>
                <Link href="/category/metal" className="block">
                    Metal
                </Link>
            </PopoverContent>
        </Popover>
    );
}

export default ItemsMenuMobile;