import NavbarClient from "./navbar-client";
import { getUserMeLoader } from "@/services/userService";

export default async function Navbar() {
  const { data: user } = await getUserMeLoader();

  return <NavbarClient user={user} />;
}