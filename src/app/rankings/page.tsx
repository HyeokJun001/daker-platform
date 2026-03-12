"use client";

import { useState, useMemo } from "react";
import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { useHackathonStore } from "@/stores/hackathonStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";

type PeriodFilter = "all" | "30d" | "hackathon";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">랭킹</h1>
        <p className="text-muted-foreground">전체 해커톤 통합 순위</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={period === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("all")}
          >
            전체
          </Button>
          <Button
            variant={period === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod("30d")}
          >
            30일
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
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

      {/* Rankings Table */}
      {aggregatedRankings.length === 0 ? (
        <EmptyState
          title="순위 데이터가 없습니다"
          description="아직 순위 데이터가 등록되지 않았습니다."
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">순위</TableHead>
                    <TableHead>팀명</TableHead>
                    <TableHead className="text-right">총점</TableHead>
                    <TableHead className="text-right">제출 수</TableHead>
                    <TableHead className="text-right">참가 해커톤</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatedRankings.map((entry) => (
                    <TableRow key={entry.teamName}>
                      <TableCell>
                        <span
                          className={`font-bold text-lg ${
                            entry.rank === 1
                              ? "text-yellow-500"
                              : entry.rank === 2
                              ? "text-gray-400"
                              : entry.rank === 3
                              ? "text-amber-600"
                              : ""
                          }`}
                        >
                          {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.teamName}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {entry.totalScore}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.submissions}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.hackathonCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
