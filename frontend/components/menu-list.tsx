"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const MenuList = () => {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Sobre nosotros</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] items-center">
                            <li className="row-span-2 items-center justify-center">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >

                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            ArtesaniasBGA
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Sumérgete en el apasionante mundo de las artesanías con nuestra web especializada en la venta de piezas únicas y de alta calidad, elaboradas por artesanos expertos.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/shop" title="Tienda">
                                Explora nuestra selección de productos disponibles y descubre lo que ofrecemos en nuestra tienda.
                            </ListItem>
                            <ListItem href="/offers" title="Ofertas">
                                Sección dedicada a promociones y descuentos especiales
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Artesanias</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default MenuList

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Cerámica",
        href: "/category/ceramica",
        description:
            "Piezas de cerámica hechas a mano, incluyendo tazas, platos y esculturas, perfectas para decorar y uso diario.",
    },
    {
        title: "Madera",
        href: "/category/madera",
        description:
            "Artesanías de madera tallada, muebles únicos y decoraciones que aportan calidez y estilo a cualquier espacio.",
    },
    {
        title: "Textiles",
        href: "/category/textiles",
        description:
            "Ropa, mantas y accesorios tejidos a mano, combinando tradición y modernidad en cada pieza.",
    },
    {
        title: "Joyería",
        href: "/category/joyeria",
        description:
            "Collares, pulseras y pendientes elaborados con materiales de alta calidad, ideales para cualquier ocasión.",
    },
    {
        title: "Vidrio",
        href: "/category/vidrio",
        description:
            "Obras de vidrio soplado y decorativo que añaden un toque artístico y elegante a tu hogar.",
    },
    {
        title: "Metal",
        href: "/category/metal",
        description:
            "Esculturas y accesorios de metal forjado, combinando resistencia y diseño contemporáneo.",
    },
]

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"