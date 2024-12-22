import { useState, useEffect } from "react";
import { fetchProductFields } from "@/services/filterService";
import { ResultFilterTypes } from "@/types/filters";

export function useGetProductField() {
  const [result, setResult] = useState<ResultFilterTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProductFields();
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