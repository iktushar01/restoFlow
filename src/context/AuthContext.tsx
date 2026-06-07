import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "admin" | "customer";

export interface User {
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("restoflow_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = (email: string, password: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === "admin@restoflow.com" && password === "admin") {
      const u: User = { email: cleanEmail, role: "admin", name: "Bistro Admin" };
      setUser(u);
      localStorage.setItem("restoflow_user", JSON.stringify(u));
      return true;
    } else if (cleanEmail === "customer@restoflow.com" && password === "customer") {
      const u: User = { email: cleanEmail, role: "customer", name: "Valued Guest" };
      setUser(u);
      localStorage.setItem("restoflow_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("restoflow_user");
    // Clear cart if desired, or keep it. Let's keep it or clear it.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
