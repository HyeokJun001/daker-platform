"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Team } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface TeamState {
  teams: Team[];
  setTeams: (t: Team[]) => void;
  addTeam: (t: Team) => void;
  getTeamsByHackathon: (slug: string) => Team[];
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: [],
      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      getTeamsByHackathon: (slug) =>
        get().teams.filter((t) => t.hackathonSlug === slug),
    }),
    {
      name: STORAGE_KEYS.TEAMS + "_store",
    }
  )
);
