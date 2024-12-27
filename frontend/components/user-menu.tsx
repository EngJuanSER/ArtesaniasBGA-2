"use client";

import { User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/data/actions/auth-actions";

interface UserMenuProps {
  user: any | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User
          strokeWidth={1}
          className="cursor-pointer text-primary transition-colors duration-200 hover:text-white"
          aria-label="Menú de Usuario"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {user ? (
          <>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Mi Perfil ({user.username})
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <form action={logoutAction}>
                <button type="submit" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </form>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => router.push("/signin")}>
              Iniciar Sesión
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/signup")}>
              Registrarse
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
