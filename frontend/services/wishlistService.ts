import { fetcher } from "./apiService";
import { getAuthToken } from "./tokenService";
import { WishlistType } from "@/types/wishlist";

export async function fetchUserWishlist(): Promise<WishlistType | null> {
  const authToken = await getAuthToken();
  if (!authToken) return null;

  try {
    const data = await fetcher("/api/wishlists?populate[wishItems][populate][product][populate][images]=*", {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (data?.data) {
      const wishlist = Array.isArray(data.data) ? data.data[0] : data.data;
      return {
        id: wishlist.id,
        slug: wishlist.slug,
        wishItems: wishlist.wishItems?.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          product: {
            ...item.product,
            images: item.product.images?.map((img: any) => ({
              ...img,
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL}${img.url}`
            })) || []
          }
        })) || []
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetchUserWishlist:", error);
    return null;
  }
}

export async function addProductToWishlist(productSlug: string): Promise<any> {
  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, error: "No autenticado" };

  try {
    const data = await fetcher("/api/wish-items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productSlug })
    });

    return { ok: true, data: data.data };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function removeProductFromWishlist(wishItemId: number): Promise<any> {
  const authToken = await getAuthToken();
  if (!authToken) return { ok: false, error: "No autenticado" };

  try {
    const data = await fetcher(`/api/wish-items/${wishItemId}`, {
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