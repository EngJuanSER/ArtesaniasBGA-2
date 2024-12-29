"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addProductBySlugToCart } from "@/services/cartService";

interface CartState {
  ok: boolean;
  error: string | null;
}

export async function serverAddToCartAction(
  prevState: CartState,
  formData: FormData
): Promise<CartState> {
  try {
    const authToken = (await cookies()).get("jwt")?.value;
    if (!authToken) {
      return { ...prevState, ok: false, error: "No autenticado" };
    }

    const productSlug = formData.get("productSlug") as string;
    const quantity = formData.get("quantity") ? Number(formData.get("quantity")) : 1;

    if (!productSlug) {
      return { ...prevState, ok: false, error: "Falta productSlug" };
    }

    if (quantity < 1) {
      return { ...prevState, ok: false, error: "Cantidad mínima es 1" };
    }

    const result = await addProductBySlugToCart(productSlug, quantity);
    if (result.ok) {
      revalidatePath("/cart");
      return { ok: true, error: null };
    }

    return { ok: false, error: result.error };
  } catch {
    return { ok: false, error: "Error al agregar al carrito" };
  }
}