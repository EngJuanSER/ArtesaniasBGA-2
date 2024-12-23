import { useState, useEffect } from "react";
import { loginUser, logoutUser, registerUser, AuthResponse } from "@/services/authService";

type User = {
  id: number;
  username: string;
  email: string;
  jwt: string;
  [key: string]: any;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Al montar el hook, verificamos si hay token en localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Podrías decodificarlo o llamar a un endpoint /users/me para obtener
      // la info del usuario y setear el state.
      // Por simplicidad, aquí no se implementa esa llamada.
      // Ejemplo:
      // fetcher("/api/users/me").then(res => setUser({...res, jwt: token}))
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    try {
      setLoading(true);
      setError("");
      const data: AuthResponse = await loginUser(email, password);
      // Guardar token en localStorage
      localStorage.setItem("token", data.jwt);
      // Actualizamos user
      setUser({ ...data.user, jwt: data.jwt });
    } catch (err: any) {
      setError(err.message || "Error de login");
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      setLoading(true);
      setError("");
      const data: AuthResponse = await registerUser(username, email, password);
      localStorage.setItem("token", data.jwt);
      setUser({ ...data.user, jwt: data.jwt });
    } catch (err: any) {
      setError(err.message || "Error de registro");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  return { user, loading, error, login, register, logout };
}