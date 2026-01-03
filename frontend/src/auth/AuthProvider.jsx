// src/auth/AuthContext.jsx
import { useMemo, useState } from "react";
import { apiFetch } from "../api/client";

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

  const value = useMemo(
    () => ({
      accessToken,
      user,
      setUser,
      login,
      signup,
      refresh,
      logout,
    }),
    [accessToken, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



