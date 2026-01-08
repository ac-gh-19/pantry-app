// src/auth/AuthContext.jsx
import { useState } from "react";
import { apiFetch } from "../../utils/client";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  async function login(email, password) {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const { accessToken, refreshToken } = res.data;

    setAccessToken(accessToken);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    return res;
  }

  async function signup(email, password) {
    const res = await apiFetch("/auth/signup", {
      method: "POST",
      body: { email, password },
    });

    return res;
  }

  async function refresh() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const res = await apiFetch("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    });

    setAccessToken(res.data.accessToken);
    return res.data.accessToken;
  }

  async function logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await apiFetch("/auth/logout", {
          method: "POST",
          body: { refreshToken },
        });
      } catch {
        // ignore logout errors; client still clears local state
      }
    }

    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(null);
  }

  // wrapper to call api without token and auto retry refresh token
  async function authFetch(path, options = {}) {
    try {
      return await apiFetch(path, { ...options, token: accessToken });
    } catch {
      try {
        const newToken = await refresh();
        return await apiFetch(path, { ...options, token: newToken });
      } catch (refreshErr) {
        if (refreshErr.status === 401) {
          await logout();
        }
        throw refreshErr;
      }
    }
  }

  const value = {
    accessToken,
    user,
    setUser,
    login,
    signup,
    refresh,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
