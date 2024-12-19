import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

const ItemsMenuMobile = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <Menu />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-2 text-primary ">
                <Link href="/shop" className="block rounded-md hover:bg-accent p-2">
                    Tienda
                </Link>
                <Link href="/offers" className="block rounded-md hover:bg-accent p-2">
                    Ofertas
                </Link>
                <Link href="/category/ceramica" className="block rounded-md hover:bg-accent p-2">
                    Cerámica
                </Link>
                <Link href="/category/madera" className="block rounded-md hover:bg-accent p-2">
                    Madera
                </Link>
                <Link href="/category/textiles" className="block rounded-md hover:bg-accent p-2">
                    Textiles
                </Link>
                <Link href="/category/joyeria" className="block rounded-md hover:bg-accent p-2">
                    Joyería
                </Link>
                <Link href="/category/vidrio" className="block rounded-md hover:bg-accent p-2">
                    Vidrio
                </Link>
                <Link href="/category/metal" className="block rounded-md hover:bg-accent p-2">
                    Metal
                </Link>
            </PopoverContent>
        </Popover>
    );
}

export default ItemsMenuMobile;