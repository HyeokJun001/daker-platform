"use client";

import { useEffect, useState } from "react";
import { initializeData } from "@/lib/data-init";
import { useHackathonStore } from "@/stores/hackathonStore";
import { useTeamStore } from "@/stores/teamStore";
import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { STORAGE_KEYS } from "@/lib/constants";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setHackathons = useHackathonStore((s) => s.setHackathons);
  const setDetails = useHackathonStore((s) => s.setDetails);
  const setTeams = useTeamStore((s) => s.setTeams);
  const setLeaderboards = useLeaderboardStore((s) => s.setLeaderboards);

  useEffect(() => {
    async function init() {
      try {
        await initializeData();

        const h = localStorage.getItem(STORAGE_KEYS.HACKATHONS);
        if (h) setHackathons(JSON.parse(h));

        const d = localStorage.getItem(STORAGE_KEYS.DETAILS);
        if (d) setDetails(JSON.parse(d));

        const t = localStorage.getItem(STORAGE_KEYS.TEAMS);
        if (t) setTeams(JSON.parse(t));

        const lb = localStorage.getItem(STORAGE_KEYS.LEADERBOARDS);
        if (lb) setLeaderboards(JSON.parse(lb));
      } catch (e) {
        console.error("Failed to load data:", e);
        setError("데이터를 불러오는 데 실패했습니다.");
      }

      setReady(true);
    }
    init();
  }, [setHackathons, setDetails, setTeams, setLeaderboards]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">데이터 로딩 실패</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>새로고침</Button>
        </div>
      </div>
    );
  }

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

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
