"use client";
import { useGetCategoryProduct } from "@/hooks/useGetCategoryProduct";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import FiltersControls from "@/components/filters-controls";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "@/components/product-card";
import { useProductFilter } from "@/hooks/useProducFilter";

export default function Page() {
  const params = useParams();
  const { categorySlug } = params;
  const { result, loading, error } = useGetCategoryProduct(categorySlug || "");
  const { filteredProducts, setFilters } = useProductFilter(result || []);

  const maxPrice = useMemo(() => {
    if (!result?.length) return 0;
    return Math.max(...result.map(p => p.offer ? (p.priceOffer || p.price) : p.price));
  }, [result]);

  if (loading) return <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24"><SkeletonSchema grid={3} /></div>;
  if (error) return <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24"><div className="text-red-500">Error: {error}</div></div>;

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {result && result.length > 0 && (
        <h1 className="text-3xl font-medium text-primary">
          Artesanías {result[0].category?.categoryName}
        </h1>
      )}
      <Separator />

      <div className="sm:flex sm:justify-between">
        <FiltersControls 
          setFilterOrigin={(value) => setFilters(prev => ({ ...prev, origin: value }))}
          setFilterSearch={(value) => setFilters(prev => ({ ...prev, searchText: value }))}
          setFilterPrice={(range) => setFilters(prev => ({ ...prev, priceRange: range }))}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          maxPrice={maxPrice}
        />

        <div className="grid gap-3 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 flex-1">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="h-min">
                <ProductCard product={product} />
              </div>))
          ) : (
            <p>No hay productos con estos filtros.</p>
          )}
        </div>
      </div>
    </div>
  );
}