export type Visibility = "public" | "private";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  language: string;
  description: string | null;
  code: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
  author?: Pick<Profile, "username" | "display_name">;
}

export interface SnippetShare {
  id: string;
  snippet_id: string;
  shared_with: string;
  email?: string;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
}

export interface SnippetInput {
  title: string;
  language: string;
  description?: string;
  code: string;
  tags: string[];
  is_public: boolean;
}
