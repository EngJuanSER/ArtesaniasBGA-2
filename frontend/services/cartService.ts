import { fetcher } from "./apiService";
import { fetchProductSlugStock } from "./productService";
import { getAuthToken } from "./tokenService";
import { CartType } from "@/types/cart";

export async function fetchUserCart(): Promise<CartType | null> {
  const authToken = await getAuthToken();
  if (!authToken) return null;

  try {
    const data = await fetcher("/api/carts?populate[user]=true&populate[cartItems][populate][product][populate][images]=*", {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (data?.data) {
      const cart = Array.isArray(data.data) ? data.data[0] : data.data;
      return {
        id: cart.id,
        total: Number(cart.total) || 0,
        bought: cart.bought || false,
        cartItems: cart.cartItems?.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          productSlug: item.product.slug,
          productName: item.product.productName,
          price: item.product.offer ? item.product.priceOffer : item.product.price,
          quantity: item.quantity,
          offer: item.product.offer,
          priceOffer: item.product.priceOffer,
          images: item.product.images?.map((img: any) => ({
            ...img,
            url: `${img.url}`
          })) || []
        })) || []
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetchUserCart:", error);
    return null;
  }
}

export async function checkProductStock(slug: string, quantity: number): Promise<boolean> {
  try {
    const response = await fetcher(`/api/products/${slug}/check-stock?quantity=${quantity}`);
    return response.data?.available || false;
  } catch (error) {
    console.error('Error checking stock:', error);
    return false;
  }
}

export async function addProductBySlugToCart(slug: string, quantity: number = 1): Promise<any> {
  const authToken = await getAuthToken();   // Se obtiene 'jwt' desde la cookie
  if (!authToken) return { ok: false, error: "No autenticado" };

  try {
    const data = await fetcher("/api/carts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,  // En caso de Strapi tokens
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ slug, quantity })
    });

    if (data?.error) {
      return { ok: false, error: data.error };
    }
    if (!data?.data) {
      return { ok: false, error: "Error desconocido" };
    }
    return { ok: true, data: data.data };
  } catch (error: any) {
    return { ok: false, error: error.message || "Error al agregar al carrito" };
  }
}

export async function deleteCartItem(cartItemId: number): Promise<any> {
  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, error: "No autenticado" };

  try {
    const data = await fetcher(`/api/cart-items/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return { ok: true, data: data.data };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}