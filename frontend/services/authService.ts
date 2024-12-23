import { fetcher } from "./apiService";

export interface AuthResponse {
  jwt: string; // token devuelto por Strapi
  user: {
    id: number;
    username: string;
    email: string;
    [key: string]: any; // más campos
  };
}

// LOGIN
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  /**
   * Strapi usa:
   * POST /api/auth/local
   * Body: { identifier: email, password: password }
   */
  const data = await fetcher("/api/auth/local", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: email,
      password,
    }),
  });
  /**
   * Strapi devuelve { jwt, user }
   */
  return data;
}

// REGISTER
export async function registerUser(username: string, email: string, password: string): Promise<AuthResponse> {
  /**
   * POST /api/auth/local/register
   * Body: { username, email, password }
   */
  const data = await fetcher("/api/auth/local/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
  return data;
}

// LOGOUT
export function logoutUser() {
  // Strapi no provee un endpoint de logout.
  // Simplemente eliminas el JWT del almacenamiento local:
  localStorage.removeItem("token"); 
  // o bien document.cookie = "token=; expires=...; path=/;";
}