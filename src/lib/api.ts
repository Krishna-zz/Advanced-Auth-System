import { AuthSession, Snippet, SnippetInput, SnippetShare } from "@/types";
import { authHeaders, getSession, setSession, supabaseFetch } from "./supabase";

const mapSnippet = (item: Record<string, unknown>): Snippet => ({
  id: String(item.id),
  user_id: String(item.user_id),
  title: String(item.title),
  language: String(item.language),
  description: item.description ? String(item.description) : null,
  code: String(item.code),
  is_public: Boolean(item.is_public),
  created_at: String(item.created_at),
  updated_at: String(item.updated_at),
  tags: Array.isArray(item.tags) ? (item.tags as string[]) : [],
});

export const api = {
  async signUp(email: string, password: string, displayName: string) {
    const data = await supabaseFetch<{ access_token: string; refresh_token: string; expires_in: number; user: { id: string; email: string } }>("/auth/v1/signup", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password, data: { display_name: displayName } }),
    });
    const session: AuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
      user: { id: data.user.id, email: data.user.email, displayName },
    };
    setSession(session);
    return session;
  },

  async signIn(email: string, password: string) {
    const data = await supabaseFetch<{ access_token: string; refresh_token: string; expires_in: number; user: { id: string; email: string; user_metadata?: { display_name?: string } } }>("/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const session: AuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
      user: {
        id: data.user.id,
        email: data.user.email,
        displayName: data.user.user_metadata?.display_name ?? email.split("@")[0],
      },
    };
    setSession(session);
    return session;
  },

  signOut() {
    setSession(null);
  },

  getCurrentSession() {
    return getSession();
  },

  async listMySnippets() {
    const session = getSession();
    if (!session) return [];
    const items = await supabaseFetch<Record<string, unknown>[]>(`/rest/v1/snippets?select=*&user_id=eq.${session.user.id}&order=updated_at.desc`, {
      headers: authHeaders(session.access_token),
    });
    return items.map(mapSnippet);
  },

  async getSnippet(id: string) {
    const session = getSession();
    const items = await supabaseFetch<Record<string, unknown>[]>(`/rest/v1/snippets?select=*&id=eq.${id}&limit=1`, {
      headers: authHeaders(session?.access_token),
    });
    if (!items.length) return null;
    return mapSnippet(items[0]);
  },

  async createSnippet(input: SnippetInput) {
    const session = getSession();
    if (!session) throw new Error("Not authenticated");
    const items = await supabaseFetch<Record<string, unknown>[]>("/rest/v1/snippets", {
      method: "POST",
      headers: { ...authHeaders(session.access_token), Prefer: "return=representation" },
      body: JSON.stringify([{ ...input, user_id: session.user.id }]),
    });
    return mapSnippet(items[0]);
  },

  async updateSnippet(id: string, input: SnippetInput) {
    const session = getSession();
    if (!session) throw new Error("Not authenticated");
    const items = await supabaseFetch<Record<string, unknown>[]>(`/rest/v1/snippets?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...authHeaders(session.access_token), Prefer: "return=representation" },
      body: JSON.stringify(input),
    });
    return mapSnippet(items[0]);
  },

  async deleteSnippet(id: string) {
    const session = getSession();
    if (!session) throw new Error("Not authenticated");
    await supabaseFetch(`/rest/v1/snippets?id=eq.${id}`, {
      method: "DELETE",
      headers: authHeaders(session.access_token),
    });
  },

  async listShares(snippetId: string) {
    const session = getSession();
    if (!session) return [];
    return supabaseFetch<SnippetShare[]>(`/rest/v1/snippet_shares?snippet_id=eq.${snippetId}&select=*`, {
      headers: authHeaders(session.access_token),
    });
  },
};
