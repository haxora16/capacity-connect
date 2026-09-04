"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { UserSession, UserRole } from "@/types";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOffline: boolean;
  loginWithCredentials: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string; redirectUrl?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // 1. Network connectivity listeners
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 2. Fetch authenticated session
    refreshUser();

    // Register service worker if in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("ServiceWorker registration failed:", err);
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshUser]);

  const loginWithCredentials = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string; redirectUrl?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return {
          success: false,
          error: data.error || "Invalid email or password.",
        };
      }

      setUser(data.user);
      setIsLoading(false);

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }

      return {
        success: true,
        redirectUrl: data.redirectUrl,
      };
    } catch (err) {
      console.error("Login failed:", err);
      setIsLoading(false);
      return {
        success: false,
        error: "Unable to connect to authentication server. Please check your network.",
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setIsLoading(false);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isOffline,
        loginWithCredentials,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
