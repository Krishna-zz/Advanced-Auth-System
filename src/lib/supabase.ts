import { AuthSession } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const SESSION_KEY = "snippetvault.session";

const requireEnv = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase environment variables are missing.");
  }
};

export const getSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as AuthSession) : null;
};

export const setSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    document.cookie = `${SESSION_KEY}=; Max-Age=0; path=/`;
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  document.cookie = `${SESSION_KEY}=1; path=/`;
};

export const authHeaders = (token?: string): HeadersInit => ({
  apikey: SUPABASE_ANON_KEY ?? "",
  Authorization: token ? `Bearer ${token}` : `Bearer ${SUPABASE_ANON_KEY ?? ""}`,
  "Content-Type": "application/json",
});

export const supabaseFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  requireEnv();
  const response = await fetch(`${SUPABASE_URL}${path}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Supabase request failed");
  }
  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
};
