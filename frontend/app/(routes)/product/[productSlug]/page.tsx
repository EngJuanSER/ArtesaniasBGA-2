import { useParams } from "next/navigation";
import { ProductType } from "@/types/product";
import { ResponseType } from "@/types/response";
import SkeletonProduct from "./components/skeleton-product";
import CarouselProduct from "./components/carousel-product";
import InfoProduct from "./components/info-product";

import { useGetProductBySlug } from "@/hooks/useGetProductBySlug";

"use client";

export default function Page() {
  const { productSlug } = useParams();
  const { result = [], loading, error }: ResponseType<ProductType> =
    useGetProductBySlug(productSlug || "");

  if (loading) return <SkeletonProduct />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!result.length) return <div>No se encontró el producto.</div>;

  return (
    <div className="max-w-6xl py-4 px-16 mx-auto sm:py-16 sm:px-10 lg:min-h-[80vh]">
      <div className="grid sm:grid-cols-2">
        <div>
          <CarouselProduct images={{ data: result[0].images }} />
        </div>
        <div className="sm:px-12">
          <InfoProduct product={result[0]} />
        </div>
      </div>
    </div>
  );
}