/* eslint-disable @next/next/no-img-element */
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
import { useEffect, useState } from "react";

const FeaturedProducts = () => {
  const { result, loading, error }: ResponseType = useGetFeaturedProducts();
  const router = useRouter();
  const [visibleProducts, setVisibleProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    if (!loading && result) {
      setVisibleProducts(result);
    }
  }, [loading, result]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-8 sm:px-24">
      <h3 className="px-6 text-3xl sm:pb-8 text-primary">Productos destacados</h3>
      <Carousel>
        <CarouselContent className="-ml-2 md:-ml-4">
          {loading && <SkeletonSchema grid={3} />}
          {!loading && visibleProducts.length > 0 ? (
            visibleProducts.map((product: ProductType, index: number) => {
              const { id, slug, images, productName, origin, price } = product;

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
                  className={`md:basis-1/2 lg:basis-1/3 group flex transition-opacity duration-500 ${
                    index < visibleProducts.length ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="p-1 flex-grow">
                    <Card className="py-4 border-muted shadow-none bg-background">
                      <CardContent className="relative flex items-center justify-center px-6 py-2">
                        <img
                          src={imageUrl}
                          alt={productName}
                          className="object-cover w-full h-64 rounded-xl"
                        />
                        <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                          <div className="flex justify-center gap-x-6">
                            <IconButton
                              onClick={() => router.push(`/product/${slug}`)}
                              icon={<Expand size={20} />}
                              className="text-gray-600"
                              aria-label="Ver más"
                            />
                            <IconButton
                              onClick={() => router.push("/cart")}
                              icon={<ShoppingCart size={20} />}
                              className="text-gray-600"
                              aria-label="Añadir al carrito"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <div className="flex justify-between gap-4 px-8 py-2">
                        <h3 className="text-lg font-bold text-primary">{productName}</h3>
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="px-2 py-1 text-white bg-secondary rounded-full w-full min-w-[6ch] truncate"
                            title={origin}
                          >
                            {origin}
                          </p>
                        </div>
                      </div>
                      <div className="px-8 pb-4">
                        <p className="mt-2 text-xl font-semibold text-primary">
                          ${price}
                        </p>
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
