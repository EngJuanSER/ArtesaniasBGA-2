import NavbarClient from "./navbar-client";
import { getUserMeLoader } from "@/services/userService";
import { getCartItemsCount } from "@/data/actions/cart-actions";
import { getWishlistItemsCount } from "@/data/actions/wishlist-actions";

export default async function Navbar() {
  const { data: user } = await getUserMeLoader();
  const cartItemsCount = await getCartItemsCount();
  const wishItemsCount = await getWishlistItemsCount();

  return <NavbarClient user={user} cartItemsCount={cartItemsCount} wishItemsCount={wishItemsCount} />;
}