import NavbarClient from "./navbar-client";
import { getUserMeLoader } from "@/services/userService";
import { getCartItemsCount } from "@/data/actions/cart-actions";

export default async function Navbar() {
  const { data: user } = await getUserMeLoader();
  const cartItemsCount = await getCartItemsCount();


  return <NavbarClient user={user} cartItemsCount={cartItemsCount} />;
}