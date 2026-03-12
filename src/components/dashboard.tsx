"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSnippets } from "@/hooks/useSnippets";
import { Badge, Button, Input, Textarea } from "@/components/ui/primitives";
import { Snippet } from "@/types";

const langs = ["typescript", "javascript", "python", "go", "rust", "sql"];

const exportSnippetImage = (snippet: Snippet) => {
  const lines = snippet.code.split("\n").slice(0, 50);
  const text = [snippet.title, `[${snippet.language}]`, ...lines, snippet.code.split("\n").length > 50 ? "...truncated" : "", "SnippetVault"]
    .filter(Boolean)
    .join("\n");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='#0f172a'/><text x='40' y='60' fill='white' font-size='24' font-family='monospace' xml:space='preserve'>${text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")}</text></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${snippet.title}.png`;
  a.click();
  URL.revokeObjectURL(url);
};

export const Dashboard = () => {
  const { session, signOut } = useAuth();
  const { snippets, createSnippet, updateSnippet, deleteSnippet } = useSnippets();
  const [active, setActive] = useState<Snippet | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => snippets.filter((s) => `${s.title} ${s.code} ${s.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase())), [search, snippets]);

  const save = async (formData: FormData) => {
    const payload = {
      title: String(formData.get("title") ?? ""),
      language: String(formData.get("language") ?? "typescript"),
      code: String(formData.get("code") ?? ""),
      description: String(formData.get("description") ?? ""),
      tags: String(formData.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      is_public: String(formData.get("is_public") ?? "off") === "on",
    };

    if (active) {
      await updateSnippet(active.id, payload);
      setActive(null);
      return;
    }
    await createSnippet(payload);
  };

  return (
    <main className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SnippetVault</h1>
          <p className="text-sm text-gray-500">Welcome, {session?.user.displayName ?? "Developer"}</p>
        </div>
        <Button onClick={signOut}>Logout</Button>
      </header>

      <section className="mb-6 rounded-lg border p-4">
        <h2 className="mb-2 text-lg font-semibold">New Snippet</h2>
        <form action={save} className="grid gap-2">
          <Input name="title" required placeholder="Snippet title" />
          <select name="language" className="rounded-md border px-3 py-2 text-sm">
            {langs.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>
          <Textarea name="description" placeholder="Description" rows={2} />
          <Textarea name="code" required placeholder="Code" rows={8} />
          <Input name="tags" placeholder="tag1, tag2" />
          <label className="text-sm"><input type="checkbox" name="is_public" /> Public</label>
          <Button type="submit">{active ? "Update snippet" : "+ New Snippet"}</Button>
        </form>
      </section>

      <Input placeholder="Search by title, code, tags" value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((snippet) => (
          <button key={snippet.id} className="rounded-lg border p-4 text-left" onClick={() => setActive(snippet)}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{snippet.title}</h3>
              <Badge>{snippet.language}</Badge>
            </div>
            <pre className="line-clamp-3 text-xs text-gray-600">{snippet.code}</pre>
          </button>
        ))}
      </div>

      {active && (
        <aside className="fixed right-0 top-0 h-full w-full max-w-xl overflow-auto border-l bg-white p-4">
          <div className="space-y-2 rounded-md border p-3">
            <h3 className="font-semibold">{active.title}</h3>
            <Badge>{active.language}</Badge>
            <pre className="overflow-auto rounded bg-slate-900 p-3 text-xs text-emerald-300">{active.code.split("\n").slice(0, 50).join("\n")}</pre>
            {active.code.split("\n").length > 50 && <p className="text-xs">...truncated</p>}
            <p className="text-xs">SnippetVault</p>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => navigator.clipboard?.writeText(active.code)}>Copy</Button>
            <Button onClick={() => exportSnippetImage(active)}>Export Image</Button>
            <Button onClick={() => void deleteSnippet(active.id).then(() => setActive(null))}>Delete</Button>
            <Button onClick={() => setActive(null)}>Close</Button>
          </div>
        </aside>
      )}
    </main>
  );
};
