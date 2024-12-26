import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";
import { useState } from "react";

const ItemsMenuMobile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
                <Menu />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col space-y-2 text-primary ">
                <Link href="/shop" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Tienda
                </Link>
                <Link href="/offers" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Ofertas
                </Link>
                <Link href="/category/ceramica" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Cerámica
                </Link>
                <Link href="/category/madera" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Madera
                </Link>
                <Link href="/category/textiles" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Textiles
                </Link>
                <Link href="/category/joyeria" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Joyería
                </Link>
                <Link href="/category/vidrio" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Vidrio
                </Link>
                <Link href="/category/metal" className="block rounded-md hover:bg-accent p-2" onClick={handleLinkClick}>
                    Metal
                </Link>
            </PopoverContent>
        </Popover>
    );
}

export default ItemsMenuMobile;