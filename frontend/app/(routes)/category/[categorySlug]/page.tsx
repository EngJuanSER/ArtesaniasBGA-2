"use client";
import { useGetCategoryProduct } from "@/hooks/useGetCategoryProduct";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import FiltersControlsCategory from "../components/filters-controls-category";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "../components/product-card";
import { useProductFilter } from "@/hooks/useProducFilter";

export default function Page() {
  const params = useParams();
  const { categorySlug } = params;
  const { result, loading, error } = useGetCategoryProduct(categorySlug || "");
  const { filteredProducts, setFilters } = useProductFilter(result || []);

  if (loading) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <SkeletonSchema grid={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {result && result.length > 0 && (
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No hay productos con estos filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
}
