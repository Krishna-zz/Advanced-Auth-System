import { api } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function PublicSnippetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const snippet = await api.getSnippet(id);
  if (!snippet || !snippet.is_public) notFound();
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">{snippet.title}</h1>
      <pre className="mt-4 overflow-auto rounded-md bg-black p-4 text-sm text-green-400">{snippet.code}</pre>
    </main>
  );
}
