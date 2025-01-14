export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetcher(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || "",
      'Accept': 'application/json',
      ...options.headers,
    },
    next: { revalidate: 0 } 
  });

  const data = await res.json();
  
  if (!res.ok) {
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Error HTTP: ${res.status}`);
    }
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