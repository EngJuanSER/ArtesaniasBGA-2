"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ProductType } from "@/types/product";
import { fetcher } from "@/services/apiService";

interface ProductState {
  ok: boolean;
  error: string | null;
  data?: ProductType | null;
}

export async function serverCreateProduct(
  data: Partial<ProductType>
): Promise<ProductState> {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    const response = await fetcher('/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...data,
          category: data.category ? { id: data.category } : undefined,
          images: data.images?.map(img => ({
            url: img.url.startsWith('http') 
              ? img.url.replace(process.env.NEXT_PUBLIC_BACKEND_URL || '', '')
              : img.url
          }))
        }
      }),
    });

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: response.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al crear el producto",
      data: null
    };
  }
}

export async function serverUpdateProduct(
  id: number,
  data: Partial<ProductType>
): Promise<ProductState> {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    const response = await fetcher(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          ...data,
          category: data.category ? { id: data.category } : undefined,
          images: data.images?.map(img => ({
            url: img.url.startsWith('http') 
              ? img.url.replace(process.env.NEXT_PUBLIC_BACKEND_URL || '', '')
              : img.url
          }))
        }
      }),
    });

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: response.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al actualizar el producto",
      data: null
    };
  }
}

export async function serverDeleteProduct(
  slug: string
): Promise<ProductState> {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    // Obtener ID del producto usando el slug
    const { data } = await fetcher(`/api/products?filters[slug][$eq]=${slug}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!data?.[0]?.id) {
      return { ok: false, error: "Producto no encontrado" };
    }

    await fetcher(`/api/products/${data[0].id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { 
      ok: false, 
      error: error.message || "Error al eliminar el producto",
      data: null
    };
  }
}