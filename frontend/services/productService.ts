import { fetcher } from "./apiService";
import { ProductType } from "@/types/product";

// Obtiene productos de una categoría
export async function fetchProductsByCategory(slug: string): Promise<ProductType[]> {
  const data = await fetcher(`/api/products?populate=*&filters[category][slug][$eq]=${slug}`);
  return data.data; 
}

// Obtiene un producto por slug
export async function fetchProductBySlug(slug: string): Promise<ProductType[]> {
  const data = await fetcher(`/api/products?filters[slug][$eq]=${slug}&populate=*`);
  return data.data;
}

// Obtiene productos destacados
export async function fetchFeaturedProducts(): Promise<ProductType[]> {
  const data = await fetcher(`/api/products?filters[isFeatured][$eq]=true&populate=*`);
  return data.data;
}

export async function fetchOffersProducts(): Promise<ProductType[]> {
  const data = await fetcher(`/api/products?filters[offer][$eq]=true&populate=*`);
  return data.data;
}

export async function fetchAllProducts(): Promise<ProductType[]> {
  const data = await fetcher(`/api/products?populate=*`);
  return data.data;
}

export async function fetchProductSlugStock(slug: string): Promise<number> {
  const data = await fetcher(`/api/products?filters[slug][$eq]=${slug}&fields[0]=stock`);
  return data.stock;
}

export async function createProduct(data: Partial<ProductType>): Promise<ProductType> {
  const response = await fetcher('/api/products', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return response.data;
}

export async function updateProduct(id: number, data: Partial<ProductType>): Promise<ProductType> {
  const response = await fetcher(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data }),
  });
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await fetcher(`/api/products/${id}`, {
    method: 'DELETE',
  });
}
