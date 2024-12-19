"use client"
import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Autoplay from 'embla-carousel-autoplay'

export const dataCarouselTop = [
    {
        id: 1,
        title: "Envío en 24/48 h",
        description: "Tus envios en 24/48 horas.",
        link:""    
    },
    {
        id: 2,
        title: "Devoluciones y entregas gratuitas",
        description: "Como cliente, tienes envíos y devoluciones gratis en un plazo de 30 días en todos los pedidos.",
        link:""
    },
    {
        id: 3,
        title: "Comprar novedades",
        description: "Todas las ofertas disponibles en nuestra tienda online.",
        link:"/offers"    
    },
]


const CarouselTextBanner = () => {
    const router = useRouter()

    return (
        <div className="bg-accent dark:bg-primary">
            <Carousel className="w-full max-w-4xl mx-auto"
                plugins={[
                    Autoplay({
                        delay: 2500
                    })
                ]}
            >
                <CarouselContent>
                    {dataCarouselTop.map(({ id, title, link, description }) => (
                        <CarouselItem key={id} onClick={() => router.push(link)} className="cursor-pointer">
                            <div>
                                <Card className="shadow-none border-none bg-transparent">
                                    <CardContent className="flex flex-col justify-center p-2 items-center text-center">
                                        <p className="sm:text-lg text-wrap dark:text-background">{title}</p>
                                        <p className="text-xs sm:text-sm text-wrap dark:text-background">{description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

export default CarouselTextBanner;