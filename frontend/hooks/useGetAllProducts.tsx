import { useState, useEffect } from "react";
import { fetchAllProducts } from "@/services/productService";
import { ProductType } from "@/types/product";

export function useGetAllProducts() {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllProducts();
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