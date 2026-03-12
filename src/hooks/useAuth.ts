"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { AuthSession } from "@/types";

export const useAuth = () => {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(api.getCurrentSession());
  }, []);

  return {
    session,
    signIn: async (email: string, password: string) => {
      const next = await api.signIn(email, password);
      setSession(next);
      return next;
    },
    signUp: async (email: string, password: string, displayName: string) => {
      const next = await api.signUp(email, password, displayName);
      setSession(next);
      return next;
    },
    signOut: () => {
      api.signOut();
      setSession(null);
    },
  };
};
