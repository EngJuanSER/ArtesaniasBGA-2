export interface CartItemType {
  id: number; // ID del CartItem
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  offer?: boolean;
  priceOffer?: number;
}

export interface CartType {
  id: number;
  total: number;
  bought: boolean;
  cartItems: CartItemType[];
}