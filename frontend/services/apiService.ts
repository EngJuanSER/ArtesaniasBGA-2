export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetcher(url: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${url}`, options);
  if (!res.ok) {
    throw new Error(`Error al obtener datos. Código: ${res.status}`);
  }
  return res.json();
}