"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ProductType } from "@/types/product";
import { fetcher } from "@/services/apiService";
import { supabase } from "@/lib/supabase";

interface ProductState {
  ok: boolean;
  error: string | null;
  data?: ProductType | null;
}

interface UploadImageResponse {
  ok: boolean;
  error?: string;
  url?: string;
}

export async function serverCreateProduct(data: Partial<ProductType>): Promise<ProductState> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    // Validaciones
    if (!data.images?.length) {
      return { ok: false, error: "Al menos una imagen es requerida" };
    }

    if (data.price && data.price > 10000000) {
      return { ok: false, error: "Precio excede el límite permitido" };
    }

    const processedData = {
      ...data,
      stock: Number(data.stock),
      price: Number(data.price),
      images: data.images?.map(img => ({
        url: img.url.startsWith('http') 
          ? img.url.replace(process.env.NEXT_PUBLIC_BACKEND_URL || '', '')
          : img.url
      })),
      category: data.category ? { id: data.category } : undefined
    };

    const response = await fetcher('/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: processedData })
    });

    if (!response.data) {
      // Si falla, eliminar las imágenes subidas
      await cleanupImages(data.images);
      throw new Error("Error al crear producto");
    }

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: response.data };
  } catch (error: any) {
    await cleanupImages(data.images);
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

    const processedData = {
      ...data,
      stock: Number(data.stock),
      price: Number(data.price),
      images: data.images?.map(img => ({
        url: img.url.startsWith('http') 
          ? img.url.replace(process.env.NEXT_PUBLIC_BACKEND_URL || '', '')
          : img.url
      })),
      category: data.category ? { id: data.category } : undefined
    };

    const response = await fetcher(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: processedData })
    });

    if (!response.data) {
      throw new Error("Error al actualizar producto");
    }

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
  id: number
): Promise<ProductState> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    // Obtener el producto para obtener las imágenes antes de eliminar
    const product = await fetcher(`/api/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!product.data) {
      return { ok: false, error: "Producto no encontrado" };
    }

    // Eliminar el producto
    const response = await fetcher(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.data) {
      throw new Error("Error al eliminar producto");
    }

    // Eliminar imágenes asociadas
    await cleanupImages(product.data.images);

    revalidatePath('/profile/admin/products');
    return { ok: true, error: null, data: response.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al eliminar el producto",
      data: null
    };
  }
}

export async function serverUploadImage(file: File): Promise<UploadImageResponse> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("jwt")?.value;
    
    if (!authToken) {
      return { ok: false, error: "No autorizado" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: "Imagen muy grande (máx 5MB)" };
    }

    if (!file.type.startsWith('image/')) {
      return { ok: false, error: "Solo se permiten imágenes" };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `files/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Error al obtener URL');
    }

    return { ok: true, url: urlData.publicUrl };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al subir imagen"
    };
  }
}

// Función auxiliar para limpiar imágenes
async function cleanupImages(images?: Array<{ url: string }>) {
  if (!images?.length) return;
  
  try {
    await Promise.all(images.map(async (img) => {
      const filePath = img.url.split('/').pop();
      if (filePath) {
        await supabase.storage
          .from('products')
          .remove([`files/${filePath}`]);
      }
    }));
  } catch (error) {
    console.error('Error eliminando imágenes:', error);
  }
}