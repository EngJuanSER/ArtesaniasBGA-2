import { fetchUserWishlist } from "@/services/wishlistService";
import WishlistClient from "./components/wishlist-client";

export default async function WishlistPage() {
  const wishlist = await fetchUserWishlist();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8">
      <WishlistClient wishlist={wishlist} />
    </div>
  );
}