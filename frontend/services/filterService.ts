import { fetcher } from "./apiService";
import { ResultFilterTypes } from "@/types/filters";

export async function fetchProductFields(): Promise<ResultFilterTypes> {
  const data = await fetcher("/api/content-type-builder/content-types/api::product.product");
  return data.data;o
}