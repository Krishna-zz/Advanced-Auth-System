"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Snippet, SnippetInput } from "@/types";

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setSnippets(await api.listMySnippets());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const actions = useMemo(
    () => ({
      createSnippet: async (input: SnippetInput) => {
        const created = await api.createSnippet(input);
        setSnippets((prev) => [created, ...prev]);
      },
      updateSnippet: async (id: string, input: SnippetInput) => {
        const updated = await api.updateSnippet(id, input);
        setSnippets((prev) => prev.map((s) => (s.id === id ? updated : s)));
      },
      deleteSnippet: async (id: string) => {
        const snapshot = snippets;
        setSnippets((prev) => prev.filter((s) => s.id !== id));
        try {
          await api.deleteSnippet(id);
        } catch (error) {
          setSnippets(snapshot);
          throw error;
        }
      },
    }),
    [snippets],
  );

  return { snippets, isLoading, refresh, ...actions };
};
