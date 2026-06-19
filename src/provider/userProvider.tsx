"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  startTransition,
} from "react";
import { getAuthUser, JWTPayload, removeAuthCookie, verifyTokenRequest, getCookie } from "@/utils/auth";

interface UserContextType {
  user: JWTPayload | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<JWTPayload | null>(null);

  const refreshUser = async () => {
    const localUser = getAuthUser();
    if (!localUser) {
      setUser(null);
      return;
    }

    const rawToken = getCookie("token");
    if (rawToken) {
      const isValid = await verifyTokenRequest(rawToken);
      if (!isValid) {
        logout();
        return;
      }
    }

    setUser(localUser);
  };

  const logout = () => {
    removeAuthCookie();
    setUser(null);
  };

  useEffect(() => {
    startTransition(() => {
      refreshUser();
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}