import { fetcher } from "./apiService";
import { getAuthToken } from "./tokenService";
import { CartType } from "@/types/cart";

export async function fetchUserCart(): Promise<CartType | null> {
  const authToken = await getAuthToken();
  if (!authToken) return null;

  try {
    const data = await fetcher("/api/carts?populate[cartItems][populate][product]=*", {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (data?.data) {
      const cart = Array.isArray(data.data) ? data.data[0] : data.data;
      return {
        id: cart.id,
        total: Number(cart.total) || 0,
        bought: cart.bought || false,
        cartItems: cart.cartItems?.map((item: any) => ({
          id: item.id, // ID del CartItem
          productId: item.product.id,
          productName: item.product.productName,
          price: item.product.offer ? item.product.priceOffer : item.product.price,
          quantity: item.quantity,
          offer: item.product.offer,
          priceOffer: item.product.priceOffer
        })) || []
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetchUserCart:", error);
    return null;
  }
}

export async function addProductBySlugToCart(slug: string, quantity: number = 1): Promise<any> {
  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, error: "No autenticado" };

  try {
    const data = await fetcher("/api/carts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ slug, quantity })
    });

    if (data?.data) {
      return { ok: true, data: data.data };
    }
    return { ok: false, error: "Error al agregar al carrito" };
  } catch {
    return { ok: false, error: "Error al agregar al carrito" };
  }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<any> {
  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, error: "No autenticado" };

  try {
    const data = await fetcher(`/api/cart-items/${cartItemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity })
    });

    if (data?.data) {
      return { ok: true, data: data.data };
    }
    return { ok: false, error: "Error al actualizar la cantidad" };
  } catch {
    return { ok: false, error: "Error al actualizar la cantidad" };
  }
}