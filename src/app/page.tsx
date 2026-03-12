import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-bold">SnippetVault</h1>
      <p className="mt-4 text-gray-600">Store, tag, and share your snippets securely.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/signup" className="rounded-md bg-black px-4 py-2 text-white">Get started</Link>
        <Link href="/login" className="rounded-md border px-4 py-2">Login</Link>
      </div>
    </main>
  );
}
