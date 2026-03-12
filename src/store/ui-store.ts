"use client";

import { useState } from "react";

export const useUiStore = () => {
  const [activeSnippetId, setActiveSnippetId] = useState<string | null>(null);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  return {
    activeSnippetId,
    setActiveSnippetId,
    isShareMenuOpen,
    setIsShareMenuOpen,
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
  };
};
