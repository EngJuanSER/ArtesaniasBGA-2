"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ProductType } from "@/types/product";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
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
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    if (!data.images?.length) {
      return { ok: false, error: "Al menos una imagen es requerida" };
    }

    if (data.price && data.price > 10000000) {
      return { ok: false, error: "Precio excede el límite permitido" };
    }

    const result = await createProduct(data);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: result.data };
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
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    // Validaciones
    if (!data.productName?.trim()) {
      return { ok: false, error: "Nombre del producto es requerido" };
    }

    if (data.price && (data.price <= 0 || data.price > 10000000)) {
      return { ok: false, error: "Precio inválido" };
    }

    if (data.stock && (data.stock < 0 || data.stock > 999)) {
      return { ok: false, error: "Stock inválido" };
    }

    const result = await updateProduct(id, data);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: result.data };
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
    const cookieStore = await cookies();
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

    const result = await deleteProduct(data[0].id);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: result.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al eliminar el producto",
      data: null
    };
  }
}