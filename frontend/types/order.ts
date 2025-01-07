import { CartItemType } from "./cart";

export interface CreateOrderParams {
  items: CartItemType[];
  total: number;
  paymentID: string;
  paymentState: "pendiente" | "exito" | "fallo";
  state: "pendiente" | "procesando" | "completado" | "cancelado";
  shippingAddres?: any;
  user?: { id: number };
}