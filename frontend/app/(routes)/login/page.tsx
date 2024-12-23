"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login, register, loading } = useAuth();
  const router = useRouter();

  // Estados para inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleLogin() {
    try {
      await login({ email, password });
      router.push("/profile");
    } catch (err) {
      console.log("Login error:", err);
    }
  }
  async function handleRegister() {
    try {
      await register({ email, password, name });
      router.push("/profile");
    } catch (err) {
      console.log("Register error:", err);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Tabs defaultValue="login" className="w-[400px] border p-4 rounded-md">
        <TabsList className="mb-4">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <div className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-primary text-white py-2 rounded hover:opacity-90"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </div>
        </TabsContent>

        <TabsContent value="register">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nombre"
              className="px-3 py-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="px-3 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="px-3 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-primary text-white py-2 rounded hover:opacity-90"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}