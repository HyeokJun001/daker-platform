"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Team } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface TeamState {
  teams: Team[];
  joinedTeams: string[];
  setTeams: (t: Team[]) => void;
  addTeam: (t: Team) => void;
  getTeamsByHackathon: (slug: string) => Team[];
  joinTeam: (teamCode: string) => void;
  leaveTeam: (teamCode: string) => void;
  isJoined: (teamCode: string) => boolean;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: [],
      joinedTeams: [],
      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      getTeamsByHackathon: (slug) =>
        get().teams.filter((t) => t.hackathonSlug === slug),
      joinTeam: (teamCode) =>
        set((state) => ({
          joinedTeams: [...state.joinedTeams, teamCode],
        })),
      leaveTeam: (teamCode) =>
        set((state) => ({
          joinedTeams: state.joinedTeams.filter((c) => c !== teamCode),
        })),
      isJoined: (teamCode) => get().joinedTeams.includes(teamCode),
    }),
    {
      name: STORAGE_KEYS.TEAMS + "_store",
    }
  )
);
