export interface WishlistType {
  id: number;
  slug: string;
  wishItems: WishItemType[];
}

export interface WishItemType {
  id: number;
  slug: string;
  product: {
    id: number;
    slug: string;
    productName: string;
    price: number;
    offer: boolean;
    priceOffer: number | null;
    images: { url: string }[];
  };
}