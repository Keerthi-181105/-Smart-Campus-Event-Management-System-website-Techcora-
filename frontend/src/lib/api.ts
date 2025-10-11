export async function apiFetch(path: string, options: RequestInit = {}) {
  const baseUrl = (import.meta as any).env?.VITE_API_URL || (window as any).VITE_API_URL || "http://localhost:4000";
  const token = localStorage.getItem("token");

  const method = (options.method || "GET").toString().toUpperCase();
  // High-signal client log for visibility
  // eslint-disable-next-line no-console
  console.info(`[api] ${method} ${baseUrl}${path}`);

  try {
    const res = await fetch(baseUrl + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // eslint-disable-next-line no-console
      console.warn("[api] Non-OK response", res.status, err);
      throw new Error(err.message || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    // eslint-disable-next-line no-console
    console.info(`[api] OK ${method} ${path}`, json);
    return json;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("[api] Fetch Error:", err);
    throw new Error(err.message || "Failed to fetch");
  }
}
