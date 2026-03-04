import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  async function login(email, senha) {
    setAuthLoading(true);
    try {
      const { data } = await api.post("/login", {
        email,
        password: senha,
      });

      const token =
        data.token ||
        data.access_token ||
        data.plainTextToken ||
        data?.data?.token ||
        data?.data?.access_token;

      if (!token) {
      console.log("Resposta do login:", data);
      throw new Error("A API não retornou token no login.");
      }

    localStorage.setItem("token", token);
      setUser(data.educator ?? data.user ?? data?.data?.educator ?? data?.data?.user ?? { email });
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, authLoading, login, logout }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>.");
  return ctx;
}