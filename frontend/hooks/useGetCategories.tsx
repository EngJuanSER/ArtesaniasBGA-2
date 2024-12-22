import { useState, useEffect } from "react";
import { fetchAllCategories } from "@/services/categoryService";
import { CategoryType } from "@/types/category";

export function useGetCategories() {
  const [result, setResult] = useState<CategoryType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAllCategories();
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