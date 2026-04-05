"use client";

import { useState, useMemo } from "react";
import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { useHackathonStore } from "@/stores/hackathonStore";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { Trophy, Medal, TrendingUp } from "lucide-react";

type PeriodFilter = "all" | "7d" | "30d";

const RANK_STYLES: Record<number, { bg: string; text: string; ring: string; emoji: string }> = {
  1: { bg: "bg-yellow-400", text: "text-yellow-900", ring: "ring-yellow-300", emoji: "🥇" },
  2: { bg: "bg-gray-300", text: "text-gray-800", ring: "ring-gray-200", emoji: "🥈" },
  3: { bg: "bg-amber-500", text: "text-amber-950", ring: "ring-amber-300", emoji: "🥉" },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

export default function RankingsPage() {
  const leaderboards = useLeaderboardStore((s) => s.leaderboards);
  const hackathons = useHackathonStore((s) => s.hackathons);
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [selectedHackathon, setSelectedHackathon] = useState<string>("all");

  const aggregatedRankings = useMemo(() => {
    const teamScores: Record<string, { totalScore: number; submissions: number; hackathons: Set<string> }> = {};

    leaderboards.forEach((lb) => {
      if (selectedHackathon !== "all" && lb.hackathonSlug !== selectedHackathon) return;

      lb.entries.forEach((entry) => {
        const now = Date.now();
        const submittedAt = new Date(entry.submittedAt).getTime();

        if (period === "7d" && now - submittedAt > 7 * 24 * 60 * 60 * 1000) return;
        if (period === "30d" && now - submittedAt > 30 * 24 * 60 * 60 * 1000) return;

        if (!teamScores[entry.teamName]) {
          teamScores[entry.teamName] = { totalScore: 0, submissions: 0, hackathons: new Set() };
        }
        teamScores[entry.teamName].totalScore += entry.score;
        teamScores[entry.teamName].submissions += 1;
        teamScores[entry.teamName].hackathons.add(lb.hackathonSlug);
      });
    });

    return Object.entries(teamScores)
      .map(([name, data]) => ({
        teamName: name,
        totalScore: Math.round(data.totalScore * 100) / 100,
        submissions: data.submissions,
        hackathonCount: data.hackathons.size,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((item, i) => ({ ...item, rank: i + 1 }));
  }, [leaderboards, period, selectedHackathon]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">랭킹</h1>
            <p className="text-muted-foreground text-sm">전체 해커톤 통합 순위</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex gap-1.5 p-1 bg-muted rounded-xl">
          {(["all", "7d", "30d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "all" ? "전체" : p === "7d" ? "7일" : "30일"}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <Button
            variant={selectedHackathon === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedHackathon("all")}
          >
            전체 해커톤
          </Button>
          {hackathons.map((h) => (
            <Button
              key={h.slug}
              variant={selectedHackathon === h.slug ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedHackathon(h.slug)}
            >
              {h.title.length > 15 ? h.title.slice(0, 15) + "..." : h.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {aggregatedRankings.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 0, 2].map((idx) => {
            const entry = aggregatedRankings[idx];
            if (!entry) return null;
            const isFirst = entry.rank === 1;
            const style = RANK_STYLES[entry.rank];
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div
                key={entry.teamName}
                className={`flex flex-col items-center p-6 rounded-2xl border transition-all ${
                  isFirst
                    ? "bg-gradient-to-b from-yellow-50 to-background dark:from-yellow-950/20 border-yellow-200 dark:border-yellow-800 -mt-4 shadow-lg"
                    : "bg-background hover:shadow-md"
                }`}
              >
                <span className="text-3xl mb-2">{style?.emoji}</span>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-3 ${avatarColor} ring-4 ${style?.ring || ""}`}>
                  {entry.teamName.charAt(0)}
                </div>
                <p className={`font-bold text-center truncate w-full ${isFirst ? "text-base" : "text-sm"}`}>
                  {entry.teamName}
                </p>
                <p className={`font-mono font-bold mt-1 ${isFirst ? "text-2xl text-primary" : "text-lg"}`}>
                  {entry.totalScore}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {entry.submissions}회 제출 · {entry.hackathonCount}개 대회
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Rankings List */}
      {aggregatedRankings.length === 0 ? (
        <EmptyState
          title="순위 데이터가 없습니다"
          description="아직 순위 데이터가 등록되지 않았습니다."
        />
      ) : (
        <div className="space-y-2">
          {aggregatedRankings.map((entry, idx) => {
            const rankStyle = RANK_STYLES[entry.rank];
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const isTop3 = entry.rank <= 3;

            return (
              <div
                key={entry.teamName}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
                  isTop3
                    ? "bg-gradient-to-r from-primary/[0.03] to-transparent border-primary/10"
                    : "bg-background hover:bg-muted/30"
                }`}
              >
                {/* Rank */}
                <div className="shrink-0 w-10 text-center">
                  {rankStyle ? (
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${rankStyle.bg} ${rankStyle.text} font-bold text-sm ring-2 ${rankStyle.ring}`}
                    >
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">
                      #{entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor}`}>
                  {entry.teamName.charAt(0)}
                </div>

                {/* Team info */}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${isTop3 ? "text-base" : "text-sm"}`}>
                    {entry.teamName}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Medal className="w-3 h-3" />
                      {entry.hackathonCount}개 대회
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {entry.submissions}회 제출
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="shrink-0 text-right">
                  <span className={`font-bold font-mono ${isTop3 ? "text-xl text-primary" : "text-base"}`}>
                    {entry.totalScore}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
