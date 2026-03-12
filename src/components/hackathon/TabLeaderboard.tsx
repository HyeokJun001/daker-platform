"use client";

import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import type { HackathonDetail } from "@/lib/types";

export default function TabLeaderboard({ detail }: { detail: HackathonDetail }) {
  const leaderboard = useLeaderboardStore((s) =>
    s.leaderboards.find((lb) => lb.hackathonSlug === detail.slug)
  );

  if (!leaderboard || leaderboard.entries.length === 0) {
    return (
      <EmptyState
        title="리더보드 데이터가 없습니다"
        description={detail.sections.leaderboard.note}
      />
    );
  }

  const hasBreakdown = leaderboard.entries.some((e) => e.scoreBreakdown);
  const hasArtifacts = leaderboard.entries.some((e) => e.artifacts);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>리더보드</span>
            <span className="text-xs font-normal text-muted-foreground">
              업데이트: {new Date(leaderboard.updatedAt).toLocaleDateString("ko-KR")}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {detail.sections.leaderboard.note}
          </p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">순위</TableHead>
                  <TableHead>팀명</TableHead>
                  <TableHead className="text-right">점수</TableHead>
                  {hasBreakdown && (
                    <TableHead className="text-right">상세</TableHead>
                  )}
                  <TableHead className="text-right">제출일</TableHead>
                  {hasArtifacts && <TableHead>산출물</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.entries.map((entry) => (
                  <TableRow key={entry.rank}>
                    <TableCell>
                      <span
                        className={`font-bold ${
                          entry.rank === 1
                            ? "text-yellow-500"
                            : entry.rank === 2
                            ? "text-gray-400"
                            : entry.rank === 3
                            ? "text-amber-600"
                            : ""
                        }`}
                      >
                        #{entry.rank}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{entry.teamName}</TableCell>
                    <TableCell className="text-right font-mono">
                      {entry.score}
                    </TableCell>
                    {hasBreakdown && (
                      <TableCell className="text-right">
                        {entry.scoreBreakdown && (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {Object.entries(entry.scoreBreakdown).map(
                              ([key, val]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {val}
                                </Badge>
                              )
                            )}
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(entry.submittedAt).toLocaleDateString("ko-KR")}
                    </TableCell>
                    {hasArtifacts && (
                      <TableCell>
                        {entry.artifacts && (
                          <div className="flex gap-2">
                            {entry.artifacts.webUrl && (
                              <a
                                href={entry.artifacts.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                웹
                              </a>
                            )}
                            {entry.artifacts.pdfUrl && (
                              <a
                                href={entry.artifacts.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                PDF
                              </a>
                            )}
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
