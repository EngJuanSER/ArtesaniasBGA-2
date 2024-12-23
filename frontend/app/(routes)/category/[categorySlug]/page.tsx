import { useParams } from "next/navigation";
import { useGetCategoryProduct } from "@/hooks/useGetCategoryProduct";
import { useProductFilter } from "@/hooks/useProductFilter";
import SkeletonSchema from "@/components/skeletonSchema";
import FiltersControlsCategory from "./components/filters-controls-category";
import { Separator } from "@/components/ui/separator";
import { ResponseType } from "@/types/response";
import { ProductType } from "@/types/product";

"use client";

export default function Page() {
  const params = useParams();
  const { categorySlug } = params;
  const { result = [], loading, error }: ResponseType<ProductType> =
    useGetCategoryProduct(categorySlug || "");
  const { filteredProducts, setFilters } = useProductFilter(result || []);

  if (error) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
        <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        {result.length > 0 && (
            <h1 className="text-3xl font-medium text-primary">
            Artesanías {result[0].category?.categoryName}
            </h1>
        )}
        <Separator />

        <div className="sm:flex sm:justify-between">
            <FiltersControlsCategory
            setFilterOrigin={(value) => {
                setFilters((prev) => ({ ...prev, origin: value }));
            }}
            />

                <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
                          
                    {loading &&(<SkeletonSchema grid={3}/>)} 

                    {filteredProducts.length > 0 ?  (
                        filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                        ))
                    ) : filteredProducts.length == 0 && result &&(
                        <p>No hay productos con estos filtro.</p>
                    )}

                </div>
            </div>
        </div>
    );
}
