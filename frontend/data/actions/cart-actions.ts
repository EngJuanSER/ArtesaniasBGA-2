"use server";

import { revalidatePath } from "next/cache";
import { addProductBySlugToCart, updateCartItemQuantity, deleteCartItem, fetchUserCart } from "@/services/cartService";

interface CartState {
  ok: boolean;
  error: string | null;
}

export async function serverAddToCartAction(
  prevState: CartState,
  formData: FormData
): Promise<CartState> {
  try {
    if (!formData || typeof formData.get !== 'function') {
      return { ok: false, error: "Datos de formulario inválidos" };
    }

    const productSlug = formData.get("productSlug") as string;
    if (!productSlug) {
      return { ok: false, error: "Producto no especificado" };
    }

    const quantity = parseInt(formData.get("quantity") as string, 10) || 1;
    const result = await addProductBySlugToCart(productSlug, quantity);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath("/cart");
    return { ok: true, error: null };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al agregar al carrito" 
    };
  }
}

export async function serverUpdateCartItemQuantity(
  cartItemId: number,
  quantity: number
): Promise<{ ok: boolean; error?: string; data?: any }> {
  try {
    const result = await updateCartItemQuantity(cartItemId, quantity);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath("/cart");
    return { ok: true, data: result.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al actualizar cantidad" 
    };
  }
}
export async function serverDeleteCartItem(
  cartItemId: number
): Promise<{ ok: boolean; error?: string; data?: any }> {
  try {
    const result = await deleteCartItem(cartItemId);
    
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    revalidatePath("/cart");
    return { ok: true, data: result.data };
  } catch (error: any) {
    return { 
      ok: false, 
      error: error.message || "Error al eliminar producto" 
    };
  }
}

export async function getCartItemsCount(): Promise<number> {
  try {
    const cart = await fetchUserCart();
    return cart?.cartItems.length || 0;
  } catch (error) {
    console.error("Error al obtener cantidad de items:", error);
    return 0;
  }
}