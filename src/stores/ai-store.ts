import { create } from "zustand";
import type { AIMessage } from "@/types/ai";
import type { JobDescription } from "@/types/job";

interface AIStore {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  targetJob: JobDescription | null;
  atsScore: number | null;
  suggestions: string[];
  activeSuggestion: string | null;

  // Actions
  addMessage: (message: AIMessage) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTargetJob: (job: JobDescription | null) => void;
  setATSScore: (score: number | null) => void;
  setSuggestions: (suggestions: string[]) => void;
  setActiveSuggestion: (suggestion: string | null) => void;
}

export const useAIStore = create<AIStore>()((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  targetJob: null,
  atsScore: null,
  suggestions: [],
  activeSuggestion: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  clearMessages: () => set({ messages: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setTargetJob: (targetJob) => set({ targetJob }),

  setATSScore: (atsScore) => set({ atsScore }),

  setSuggestions: (suggestions) => set({ suggestions }),

  setActiveSuggestion: (activeSuggestion) => set({ activeSuggestion }),
}));
