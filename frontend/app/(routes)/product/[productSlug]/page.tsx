"use client"

import { useGetProductBySlug } from "@/hooks/useGetProductBySlug";
import { useParams } from "next/navigation"
import SkeletonProduct from "./components/skeleton-product";
import CarouselProduct from "./components/carousel-product";
import InfoProduct from "./components/info-product";

export default function Page() {
  const params = useParams();
  const { result, loading, error } = useGetProductBySlug(params.productSlug || "");
  console.log("result", result);
  if (loading || !result) {
    return <SkeletonProduct />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

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
  )
}
