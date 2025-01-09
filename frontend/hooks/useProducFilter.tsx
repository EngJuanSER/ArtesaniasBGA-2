import { useMemo, useState } from "react";
import { ProductType } from "@/types/product";
import { FilterOptions } from "@/types/filters";

export function useProductFilter(products: ProductType[]) {
  const defaultMax = 9999999;
  const [filters, setFilters] = useState<FilterOptions>({
    origin: "",
    searchText: "",
    priceRange: { min: 0, max: defaultMax },
    sortBy: "name-asc",
  });

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      if (filters.origin && p.origin !== filters.origin) return false;
      if (filters.searchText && !p.productName.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
      
      const comparePrice = p.offer && p.priceOffer ? p.priceOffer : p.price;
      if (comparePrice < filters.priceRange.min || comparePrice > filters.priceRange.max) return false;
      
      return true;
    });
    filtered.sort((a, b) => {
      const priceA = a.offer && a.priceOffer ? a.priceOffer : a.price;
      const priceB = b.offer && b.priceOffer ? b.priceOffer : b.price;

      switch (filters.sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return a.productName.localeCompare(b.productName);
        case "name-desc":
          return b.productName.localeCompare(a.productName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  return {
    filteredProducts,
    filters,
    setFilters,
  };
}