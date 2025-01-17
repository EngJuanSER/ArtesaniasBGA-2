/* eslint-disable @next/next/no-img-element */
import { Expand } from "lucide-react";
import { useRouter } from "next/navigation";

import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { AddToCartButton } from "@/components/add-cart";

import IconButton from "@/components/icon-button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

type ProductCardProps = {
    product: ProductType;
};

const ProductCard = (props: ProductCardProps) => {
    const { product } = props;
    const router = useRouter();

    return (
        <div className="relative flex flex-col h-full p-2 transition-all duration-100 rounded-lg hover:shadow-md bg-accent">
            {/* Badge de origen */}
            <div className="absolute z-[1] top-4 left-4">
                <p className="px-2 py-1 text-xs text-white bg-yellow-900 rounded-full w-fit">
                    {product.origin}
                </p>
            </div>

            {/* Badge de oferta */}
            {product.offer && (
                <div className="absolute z-[1] top-4 right-4 rotate-12 animate-pulse">
                    <div className="px-3 py-1 text-sm font-bold text-white bg-destructive rounded-md shadow-lg">
                        ¡Oferta!
                    </div>
                </div>
            )}

            {/* Carousel de imágenes */}
            <div className="flex-grow">
                <Carousel opts={{ align: "start" }} className="w-full max-w-sm">
                    <CarouselContent>
                        {product.images.map((image) => (
                            <CarouselItem key={image.id} className="group">
                                <div className="relative h-[300px] w-full">
                                    <img
                                        src={image.url.startsWith('http') ? image.url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${image.url}`}
                                        alt={image.alternativeText || "Image"}
                                        className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                    />
                                    <div className="absolute w-full px-6 transition duration-200 opacity-0 group-hover:opacity-100 bottom-5">
                                        <div className="flex justify-center gap-x-6">
                                            <IconButton
                                                onClick={() => router.push(`/product/${product.slug}`)}
                                                icon={<Expand size={20} />}
                                                className="dark:text-muted hover:text-white hover:bg-primary dark:hover:text-white"
                                            />
                                            <AddToCartButton productSlug={product.slug} />
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div className="mt-2 space-y-1"> {/* Reducido mt-4 a mt-2 y space-y-2 a space-y-1 */}
                <p className="text-base text-center text-destructive"> {/* Cambiado text-xl a text-base */}
                    {product.productName}
                </p>
                <div className="flex items-center justify-center gap-2">
                    {product.offer ? (
                        <>
                            <p className="text-sm font-medium text-gray-500 line-through">
                                {formatPrice(product.price)}
                            </p>
                            <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                                {product.priceOffer !== null ? formatPrice(product.priceOffer) : null}
                            </p>
                        </>
                    ) : (
                        <p className="text-lg font-medium text-scoundary">
                            {formatPrice(product.price)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;