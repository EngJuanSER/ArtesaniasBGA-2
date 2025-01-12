import { API_BASE_URL } from "@/services/apiService";
import { getAuthToken } from "@/services/tokenService";

export async function getUserMeLoader() {
  const url = new URL("/api/users/me?populate=role", API_BASE_URL);
  const authToken = await getAuthToken();

  if (!authToken) {
    return { ok: false, data: null, error: null };
  }

  try {
    const response = await fetch(url.href, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    
    const data = await response.json();
    
    if (data.error) {
      return { ok: false, data: null, error: data.error };
    }
    
    return { ok: true, data, error: null };
  } catch (error) {
    console.error(error);
    return { ok: false, data: null, error };
  }
}

