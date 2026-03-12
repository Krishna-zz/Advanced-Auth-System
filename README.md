# SnippetVault

SnippetVault is a full-stack code snippet manager built with Next.js App Router and Supabase-ready APIs.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Setup

Create these tables:
- `profiles`
- `snippets`
- `tags`
- `snippet_tags`
- `snippet_shares`

Enable RLS and apply policies so:
- Public snippets are readable by all.
- Owners can CRUD own snippets.
- Shared users can read shared private snippets.
- Only snippet owner can manage snippet shares.

## Architecture Decisions

- **App Router** routes for workspace/public pages under `src/app`.
- **Central API layer** in `src/lib/api.ts` (components do not directly call Supabase).
- **Typed domain models** in `src/types/index.ts`.
- **Custom data hooks** in `src/hooks` encapsulate fetch/mutation logic.
- **Middleware protection** for `/dashboard` via `middleware.ts`.

## Deployment

Deploy on Vercel and configure the same environment variables in project settings.
