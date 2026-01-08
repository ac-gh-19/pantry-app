const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, token, headers = {} } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json?.error?.message || "Request failed");
    err.status = res.status;
    err.code = json?.error?.code;
    err.details = json?.error?.details;
    throw err;
  }

  return json;
}
