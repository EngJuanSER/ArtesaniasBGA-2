"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl">¡Hola, {user.name || user.email}!</h1>
      {user.role === "admin" && (
        <div className="mt-4">
          <p>Aquí podrías poner enlaces a reportes, etc.</p>
        </div>
      )}
      {/* Agregar más secciones según el rol */}
    </div>
  );
}