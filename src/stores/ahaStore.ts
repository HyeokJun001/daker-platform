"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  skills: string[];
  experience: "beginner" | "intermediate" | "advanced";
  interests: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    fitScore?: number;
    missingSkills?: string[];
    recommendations?: string[];
  };
}

interface AHAState {
  profile: UserProfile | null;
  chatHistory: Record<string, ChatMessage[]>;
  isOpen: boolean;
  setProfile: (p: UserProfile) => void;
  addMessage: (slug: string, msg: ChatMessage) => void;
  clearChat: (slug: string) => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

export const useAHAStore = create<AHAState>()(
  persist(
    (set, get) => ({
      profile: null,
      chatHistory: {},
      isOpen: false,
      setProfile: (profile) => set({ profile }),
      addMessage: (slug, msg) =>
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [slug]: [...(state.chatHistory[slug] || []), msg],
          },
        })),
      clearChat: (slug) =>
        set((state) => {
          const copy = { ...state.chatHistory };
          delete copy[slug];
          return { chatHistory: copy };
        }),
      setOpen: (isOpen) => set({ isOpen }),
      toggleOpen: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "daker_aha",
      partialize: (state) => ({
        profile: state.profile,
        chatHistory: state.chatHistory,
      }),
    }
  )
);
