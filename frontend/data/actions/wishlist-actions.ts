"use server";

import { revalidatePath } from "next/cache";
import { addProductToWishlist, removeProductFromWishlist, fetchUserWishlist } from "@/services/wishlistService";

interface WishlistState {
  ok: boolean;
  error: string | null;
}

export async function serverAddToWishlist(
  prevState: WishlistState,
  formData: FormData
): Promise<WishlistState> {
  try {
    if (!formData || typeof formData.get !== 'function') {
      return { ok: false, error: "Datos de formulario inválidos" };
    }

    const productSlug = formData.get("productSlug") as string;
    if (!productSlug) {
      return { ok: false, error: "Producto no especificado" };
    }

    const result = await addProductToWishlist(productSlug);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath("/wishlist");
    return { ok: true, error: null };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al agregar a favoritos" 
    };
  }
}

export async function serverRemoveFromWishlist(
  wishItemId: number
): Promise<{ ok: boolean; error?: string; data?: any }> {
  try {
    const result = await removeProductFromWishlist(wishItemId);
    if (!result.ok) return { ok: false, error: result.error };
    
    revalidatePath("/wishlist");
    return { ok: true, data: result.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al eliminar de favoritos" 
    };
  }
}

export async function getWishlistItemsCount(): Promise<number> {
  try {
    const wishlist = await fetchUserWishlist();
    return wishlist?.wishItems.length || 0;
  } catch (error) {
    console.error("Error al obtener cantidad de favoritos:", error);
    return 0;
  }
}