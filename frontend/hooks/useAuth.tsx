import { useState, useEffect } from "react";
import { loginUser, logoutUser, registerUser, User } from "@/services/authService";
import { fetcher } from "@/services/apiService";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Llamamos a /api/users/me en Strapi, que verifica la cookie en cada request
    // y retorna la info del usuario si la cookie es válida
    async function fetchUser() {
      try {
        const res = await fetcher("/api/users/me", { credentials: "include" });
        setUser(res); // Strapi retorna info del user si la cookie JWT es válida
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError("");
      const userData = await loginUser(email, password);
      setUser(userData);
    } catch (err: any) {
      setError(err.message || "Error de login");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      setLoading(true);
      setError("");
      const userData = await registerUser(username, email, password);
      setUser(userData);
    } catch (err: any) {
      setError(err.message || "Error de registro");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await logoutUser();
    setUser(null);
  }

  return { user, loading, error, login, register, logout };
}