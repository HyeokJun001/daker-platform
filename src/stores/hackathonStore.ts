"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Hackathon, HackathonDetail } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface HackathonState {
  hackathons: Hackathon[];
  details: HackathonDetail[];
  bookmarks: string[];
  setHackathons: (h: Hackathon[]) => void;
  setDetails: (d: HackathonDetail[]) => void;
  toggleBookmark: (slug: string) => void;
  getDetail: (slug: string) => HackathonDetail | undefined;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      hackathons: [],
      details: [],
      bookmarks: [],
      setHackathons: (hackathons) => set({ hackathons }),
      setDetails: (details) => set({ details }),
      toggleBookmark: (slug) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(slug)
            ? state.bookmarks.filter((s) => s !== slug)
            : [...state.bookmarks, slug],
        })),
      getDetail: (slug) => get().details.find((d) => d.slug === slug),
    }),
    {
      name: STORAGE_KEYS.HACKATHONS + "_store",
    }
  )
);
