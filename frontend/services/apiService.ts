export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetcher(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  });

  const data = await res.json();
  
  if (!res.ok) {
    // Si es un error de Strapi
    if (data.error && typeof data.error === 'string') {
      throw new Error(data.error);
    }
    // Si es un error con mensaje anidado
    if (data.error?.message) {
      throw new Error(data.error.message);
    }
    throw new Error("Error en la operación");
  }

  return data;
}