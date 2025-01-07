'use server'

import { getAuthToken } from "@/services/tokenService";
import { fetcher } from "@/services/apiService";
import { CreateOrderParams } from "@/types/order";
import { revalidatePath } from "next/cache";

export async function createOrder(params: CreateOrderParams) {
  const authToken = await getAuthToken();
  if (!authToken) throw new Error("No autenticado");

  try {
    const userData = await fetcher("/api/users/me", {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    const response = await fetcher("/api/orders", {
      method: "POST",  
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: {
          ...params,
          user: userData.id, // Asociar usuario
          publishedAt: new Date()
        }
      })
    });

    revalidatePath('/orders');
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}