import { ProductType } from "@/types/product";
import { ResponseType } from "@/types/response";
import { useEffect, useState } from "react";


export function useGetFeaturedProducts(): ResponseType {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filters[isFeatured][$eq]=true&populate=*`;
  const [result, setResult] = useState<ProductType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        setResult(json.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Error desconocido");
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [url]);

  return { result, loading, error };
}