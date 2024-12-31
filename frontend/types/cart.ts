export interface CartItemType {
  id: number;
  slug: string; 
  productSlug: string;
  productName: string;
  price: number;
  quantity: number;
  offer: boolean;
  priceOffer: number|null;
  images: {
    url: string;
  }[];
}

export interface CartType {
  id: number;
  total: number;
  bought: boolean;
  user?: { id: number };
  cartItems: CartItemType[];
}
