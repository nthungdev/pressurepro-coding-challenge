"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { verifySession } from "@/lib/session";

type AuthContextType = Awaited<ReturnType<typeof verifySession>>;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AuthContextType;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
