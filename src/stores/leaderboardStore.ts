"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LeaderboardData } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface LeaderboardState {
  leaderboards: LeaderboardData[];
  setLeaderboards: (lb: LeaderboardData[]) => void;
  getByHackathon: (slug: string) => LeaderboardData | undefined;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      leaderboards: [],
      setLeaderboards: (leaderboards) => set({ leaderboards }),
      getByHackathon: (slug) =>
        get().leaderboards.find((lb) => lb.hackathonSlug === slug),
    }),
    {
      name: STORAGE_KEYS.LEADERBOARDS + "_store",
    }
  )
);
