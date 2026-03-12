export const revalidate = 120;

export default async function UserPublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">@{username}</h1>
      <p className="mt-2 text-sm text-gray-500">No public snippets yet</p>
    </main>
  );
}
