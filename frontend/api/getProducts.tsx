import { CategoryType } from "@/types/category";
import { ResponseType } from "@/types/response";
import { useEffect, useState } from "react";

export function useGetCategories(): ResponseType<CategoryType> {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`;
  const [result, setResult] = useState<CategoryType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
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

    fetchCategories();
  }, [url]);

  return { result, loading, error };
}