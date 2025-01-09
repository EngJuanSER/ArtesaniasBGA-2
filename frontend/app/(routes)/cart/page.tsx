import { fetchUserCart } from "@/services/cartService";
import CartClient from "./components/cart-client";

export default async function CartPage() {
  const cart = await fetchUserCart();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <CartClient cart={cart} />
    </div>
  );
}