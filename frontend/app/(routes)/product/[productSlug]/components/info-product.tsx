"use client";

import ProductTasteOrigin from "@/components/shared/product-origin";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/formatPrice";
import { ProductType } from "@/types/product";
import { AddToCartForm } from "./cartForm";
import { WishlistForm } from "./wishlistForm";

export type InfoProductProps = {
  product: ProductType; 
};

const InfoProduct = ({ product }: InfoProductProps) => {
  return (
    <div className="px-6">
      <div className="justify-between mb-3 sm:flex">
        <h1 className="text-2xl text-primary">{product.productName}</h1>
        <ProductTasteOrigin origin={product.origin} />
      </div>
      <Separator className="my-4" />
      <p>{product.description}</p>
      <Separator className="my-4" />
      <p className="my-4 text-2xl">        {product.offer ? (
          <span>
            <span className="line-through text-gray-500 mr-2">
              {formatPrice(product.price)}
            </span>
            {product.priceOffer !== null ? formatPrice(product.priceOffer) : null}
          </span>
        ) : (
          formatPrice(product.price)
        )}
      </p>
      <div className="flex items-center gap-5">
        <AddToCartForm productSlug={product.slug} />
        <WishlistForm productSlug={product.slug} />
      </div>
    </div>
  );
};

export default InfoProduct;