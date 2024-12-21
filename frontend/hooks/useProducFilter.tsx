import { useMemo, useState } from "react";
import { ProductType } from "@/types/product";

interface FilterOptions {
  origin: string;
  searchText: string;
  // Otros filtros que necesites...
}

export function useProductFilter(products: ProductType[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    origin: "",
    searchText: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Filtrado por origen
      if (filters.origin && p.origin !== filters.origin) return false;
      // Ejemplo filtrado por cadena de texto
      if (
        filters.searchText &&
        !p.productName.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [products, filters]);

  return {
    filteredProducts,
    filters,
    setFilters,
  };
}