// admin/src/lib/api.js
const RAW_BASE =
  (process.env.REACT_APP_API_BASE || "http://localhost:5000/api").trim();

export const API_BASE = RAW_BASE.replace(/\/+$/, "");

export function buildUrl(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

export async function authFetch(path, options = {}) {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: "include",
  });

  // ✅ HANDLE INVALID TOKEN CLEANLY
  if (res.status === 401) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    throw new Error("Session expired");
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }

  return res;
}
