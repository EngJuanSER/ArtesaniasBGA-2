"use client";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import SkeletonSchema from "@/components/skeletonSchema";
import ProductCard from "@/components/product-card";
import FiltersControls from "@/components/filters-controls";
import { useGetOffersProducts } from "@/hooks/useGetOfferProducts";
import { useProductFilter } from "@/hooks/useProducFilter";

export default function Page() {
  const { result, loading, error } = useGetOffersProducts();
  const { filteredProducts, setFilters } = useProductFilter(result || []);

  const maxPrice = useMemo(() => {
    if (!result?.length) return 0;
    return Math.max(...result.map(p => p.offer ? (p.priceOffer || p.price) : p.price));
  }, [result]);

  if (loading) return <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24"><SkeletonSchema grid={3} /></div>;
  if (error) return <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24"><div className="text-red-500">Error: {error}</div></div>;

  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      <h1 className="text-3xl font-medium text-primary">Ofertas</h1>
      <Separator />

      <div className="sm:flex sm:justify-between">
        <FiltersControls 
          setFilterOrigin={(value) => setFilters(prev => ({ ...prev, origin: value }))}
          setFilterSearch={(value) => setFilters(prev => ({ ...prev, searchText: value }))}
          setFilterPrice={(range) => setFilters(prev => ({ ...prev, priceRange: range }))}
          setSortBy={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
          maxPrice={maxPrice}
        />

        <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10 flex-1">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="h-min">
                  <ProductCard product={product} />  
                </div>
                ))
            ) : (
              <p>No hay productos disponibles.</p>
            )}
        </div>
      </div>
    </div>
  );
}