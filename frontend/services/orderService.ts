import { CreateOrderParams } from "@/types/order";
import { fetcher } from "./apiService";
import { getAuthToken } from "./tokenService";

export class OrderService {
  // Métodos para PayPal
  static async createPayPalOrder(items: any[], total: number) {
    try {
      const response = await fetcher('/api/paypal/create-order', { // Mantener /api/ aquí
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items, total })
      });
      return response;
    } catch (error) {
      console.error("[OrderService] Error creating PayPal order:", error);
      throw error;
    }
  }

  static async capturePayPalOrder(orderId: string) {
    try {
      const response = await fetcher(`/api/paypal/capture-order/${orderId}`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error("[OrderService] Error capturing PayPal order:", error);
      throw error;
    }
  }

  // Método para Strapi
  static async createOrder(params: CreateOrderParams) {
    const authToken = await getAuthToken();
    if (!authToken) throw new Error("Sin autenticación");

    try {
      const response = await fetcher("/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: params })
      });
      return response.data;
    } catch (error) {
      console.error("[OrderService] Error creating Strapi order:", error);
      throw error;
    }
  }
}