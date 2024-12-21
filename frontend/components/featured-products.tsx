
"use client";

import { useGetFeaturedProducts } from "@/api/useGetFeaturedProducts";
import { ResponseType } from "@/types/response";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import SkeletonSchema from "./skeletonSchema";
import { ProductType } from "@/types/product";
import { Card, CardContent } from "./ui/card";
import { Expand, ShoppingCart } from "lucide-react";
import IconButton from "./icon-button";
import { useRouter } from "next/navigation";

const FeaturedProducts = () => {
  const { result, loading, error }: ResponseType<ProductType> = useGetFeaturedProducts();
  const router = useRouter();

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-8 sm:px-24">
      <h3 
        className="w-max px-6 font-semibold text-3xl sm:pb-6 text-primary hover:text-white transition-colors duration-100"
        aria-label="Productos destacados"
        onMouseEnter={() => {}}
      >
        {"Productos destacados".split("").map((char: string, index: number) => (
          <span 
        key={index}
        className="inline-block transition-colors duration-100"
        style={{ transitionDelay: `${index * 35}ms` }}
          >
        {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h3>
      <Carousel>
        <CarouselContent className="-ml-2 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}
          {!loading && result && result.length > 0 ? (
            result.map((product: ProductType) => {
              const { id, slug, images, productName, origin, description, price } = product;

              if (!slug || !images || !productName || !origin) {
                console.warn(`El producto con id ${id} tiene datos incompletos.`);
                return null;
              }

              const firstImage = images[0];
              const imageUrl = firstImage?.url
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${firstImage.url}`
                : "/ruta/a/imagen/default.jpg";

              return (
                <CarouselItem
                  key={id}
                  className="md:basis-1/2 lg:basis-1/3 group"
                >
                  <div className="p-1">
                    <Card className="p-4 bg-accent shadow-none hover:shadow-2xl">
                      <CardContent className="relative flex items-center justify-center px-6 py-2">
                        <img
                          src={imageUrl}
                          alt={productName}
                          className="object-cover h-48 transition duration-300 ease-in-out rounded-lg"
                        />
                        <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                          <div className="flex justify-center gap-x-6">
                            <IconButton
                              onClick={() => router.push(`/product/${slug}`)}
                              icon={<Expand size={20} />}
                              className="text-primary"
                              aria-label="Ver más"
                            />
                            <IconButton
                              onClick={() => router.push("/cart")}
                              icon={<ShoppingCart size={20} />}
                              className="text-primary"
                              aria-label="Añadir al carrito"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <div className="flex justify-between gap-4 px-8 py-2">
                        <h3 className="text-lg text-destructive font-bold">{productName}</h3>
                        <div className="flex items-center justify-between gap-3">
                          <p className="px-2 py-1 text-accent dark:text-primary bg-primary  dark:bg-background rounded-full w-max">
                            {origin}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })
          ) : (
            !loading && <div>No hay productos destacados disponibles.</div>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default FeaturedProducts;