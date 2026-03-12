"use client";

import { useEffect, useState } from "react";
import { initializeData } from "@/lib/data-init";
import { useHackathonStore } from "@/stores/hackathonStore";
import { useTeamStore } from "@/stores/teamStore";
import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { STORAGE_KEYS } from "@/lib/constants";

export default function DataInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const setHackathons = useHackathonStore((s) => s.setHackathons);
  const setDetails = useHackathonStore((s) => s.setDetails);
  const setTeams = useTeamStore((s) => s.setTeams);
  const setLeaderboards = useLeaderboardStore((s) => s.setLeaderboards);

  useEffect(() => {
    async function init() {
      await initializeData();

      // Load from localStorage into stores
      try {
        const h = localStorage.getItem(STORAGE_KEYS.HACKATHONS);
        if (h) setHackathons(JSON.parse(h));

        const d = localStorage.getItem(STORAGE_KEYS.DETAILS);
        if (d) setDetails(JSON.parse(d));

        const t = localStorage.getItem(STORAGE_KEYS.TEAMS);
        if (t) setTeams(JSON.parse(t));

        const lb = localStorage.getItem(STORAGE_KEYS.LEADERBOARDS);
        if (lb) setLeaderboards(JSON.parse(lb));
      } catch (e) {
        console.error("Failed to load data from localStorage:", e);
      }

      setReady(true);
    }
    init();
  }, [setHackathons, setDetails, setTeams, setLeaderboards]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
