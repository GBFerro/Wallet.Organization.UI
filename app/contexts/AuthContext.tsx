import { getToken, getUser, removeToken, signIn, signUp } from "@services/api";
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await getToken();
      const storedUser = await getUser();

      if (token && storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Check auth error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    console.log("AuthContext: Starting login...");
    const result = await signIn({ email, password });
    console.log("AuthContext: signIn result:", result.success, result.message);

    if (result.success && result.data) {
      console.log("AuthContext: Setting user:", result.data.user);
      setUser(result.data.user);
    }

    return { success: result.success, message: result.message };
  }

  async function register(name: string, email: string, password: string) {
    const result = await signUp({ name, email, password });

    if (result.success) {
      const loginResult = await login(email, password);
      return loginResult;
    }

    return { success: result.success, message: result.message };
  }

  async function logout() {
    await removeToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
