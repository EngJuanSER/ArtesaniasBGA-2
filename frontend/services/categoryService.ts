import { fetcher } from "./apiService";
import { CategoryType } from "@/types/category";

export async function fetchAllCategories(): Promise<CategoryType[]> {
  const data = await fetcher("/api/categories?populate=*");
  return data.data;
}