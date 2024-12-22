import { useState, useEffect } from "react";
import { fetchProductBySlug } from "@/services/productService";
import { ProductType } from "@/types/product";

export function useGetProductBySlug(slug: string | string[]) {
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProductBySlug(String(slug));
        setResult(data);
      } catch (err: any) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return { result, loading, error };
}