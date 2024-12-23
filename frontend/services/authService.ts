import { fetcher } from "./apiService";

export interface User {
  id: number;
  username: string;
  email: string; 
  [key: string]: any;
}

// La respuesta de Strapi ya no incluye { jwt } en el body, si así lo configuras
// pero puedes mandar user para saber quién se logueó
export async function loginUser(email: string, password: string): Promise<User> {
  // POST /api/auth/local
  const data = await fetcher("/api/auth/local", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, password }),
    // Strapi enviará el JWT en una cookie "Set-Cookie"
    // ¡Asegúrate de activar las credenciales en la fetch!
    credentials: "include", // <-- para que el navegador guarde la cookie
  });
  return data.user; // Strapi te regresa user
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
  // POST /api/auth/local/register
  const data = await fetcher("/api/auth/local/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    credentials: "include",
  });
  return data.user;
}

export async function logoutUser(): Promise<void> {
  // Este endpoint puede ser tuyo para borrar cookie, p.ej. /api/auth/logout
  await fetcher("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}