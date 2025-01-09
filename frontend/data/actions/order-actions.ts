'use server'

import { OrderService } from "@/services/orderService";
import { CreateOrderParams } from "@/types/order";
import { revalidatePath } from "next/cache";

export async function createOrder(params: CreateOrderParams) {
  try {
    const order = await OrderService.createOrder(params);
    revalidatePath('/orders');
    return order;
  } catch (error) {
    console.error("[OrderActions] Error creating order:", error);
    throw error;
  }
}

export async function createPayPalOrder(items: any[], total: number) {
  try {
    const order = await OrderService.createPayPalOrder(items, total);
    return order;
  } catch (error) {
    console.error("[OrderActions] Error creating PayPal order:", error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const order = await OrderService.capturePayPalOrder(orderId);
    return order;
  } catch (error) {
    console.error("[OrderActions] Error capturing PayPal order:", error);
    throw error;
  }
}