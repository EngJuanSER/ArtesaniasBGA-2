import { useState, useEffect } from "react";
import { fetchOffersProducts } from "@/services/productService";
import { ProductType } from "@/types/product";

export function useGetOffersProducts() {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchOffersProducts();
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { result, loading, error };
}