import { cookies } from "next/headers";
import { SESSION_KEY } from "./supabase";

export const hasSessionCookie = async () => {
  const store = await cookies();
  return Boolean(store.get(SESSION_KEY));
};
