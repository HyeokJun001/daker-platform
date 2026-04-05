"use client";

import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { useTeamStore } from "@/stores/teamStore";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import type { HackathonDetail } from "@/lib/types";
import { Trophy, ExternalLink, FileText, AlertCircle } from "lucide-react";

const RANK_STYLES: Record<number, { bg: string; text: string; ring: string }> = {
  1: { bg: "bg-yellow-400", text: "text-yellow-900", ring: "ring-yellow-300" },
  2: { bg: "bg-gray-300", text: "text-gray-800", ring: "ring-gray-200" },
  3: { bg: "bg-amber-500", text: "text-amber-950", ring: "ring-amber-300" },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

export default function TabLeaderboard({
  detail,
}: {
  detail: HackathonDetail;
}) {
  const leaderboard = useLeaderboardStore((s) =>
    s.leaderboards.find((lb) => lb.hackathonSlug === detail.slug)
  );
  const teams = useTeamStore((s) => s.teams);
  const hackathonTeams = teams.filter(
    (t) => t.hackathonSlug === detail.slug
  );

  if (
    !leaderboard ||
    (leaderboard.entries.length === 0 && hackathonTeams.length === 0)
  ) {
    return (
      <EmptyState
        title="리더보드 데이터가 없습니다"
        description={detail.sections.leaderboard.note}
      />
    );
  }

  const entries = leaderboard?.entries || [];
  const submittedTeamNames = new Set(entries.map((e) => e.teamName));
  const unsubmittedTeams = hackathonTeams.filter(
    (t) => !submittedTeamNames.has(t.name)
  );
  const evalInfo = detail.sections.eval;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">리더보드</h3>
            <p className="text-xs text-muted-foreground">
              {entries.length}팀 참가
              {leaderboard && ` · ${new Date(leaderboard.updatedAt).toLocaleDateString("ko-KR")} 업데이트`}
            </p>
          </div>
        </div>
      </div>

      {/* Eval formula chips */}
      {evalInfo.scoreDisplay?.breakdown && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground">평가 산식</span>
          {evalInfo.scoreDisplay.breakdown.map((b) => (
            <span key={b.key} className="px-2.5 py-1 rounded-full bg-background text-xs font-medium border">
              {b.label} {b.weightPercent}%
            </span>
          ))}
        </div>
      )}

      {/* Note */}
      <p className="text-sm text-muted-foreground px-1">
        {detail.sections.leaderboard.note}
      </p>

      {/* Leaderboard rows */}
      <div className="space-y-2">
        {entries.map((entry, idx) => {
          const rankStyle = RANK_STYLES[entry.rank];
          const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const isTop3 = entry.rank <= 3;

          return (
            <div
              key={entry.rank}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md ${
                isTop3
                  ? "bg-gradient-to-r from-primary/[0.03] to-transparent border-primary/10"
                  : "bg-background hover:bg-muted/30"
              }`}
            >
              {/* Rank badge */}
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

              {/* Team avatar */}
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor}`}>
                {entry.teamName.charAt(0)}
              </div>

              {/* Team info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isTop3 ? "text-base" : "text-sm"}`}>
                  {entry.teamName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.submittedAt).toLocaleDateString("ko-KR")}
                  </span>
                  {entry.scoreBreakdown && (
                    <div className="flex gap-1">
                      {Object.entries(entry.scoreBreakdown).map(([key, val]) => (
                        <span key={key} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {key}: {val}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Artifacts */}
              {entry.artifacts && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {entry.artifacts.webUrl && (
                    <a
                      href={entry.artifacts.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                      title="웹 보기"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  )}
                  {entry.artifacts.pdfUrl && (
                    <a
                      href={entry.artifacts.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                      title="PDF 보기"
                    >
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
              )}

              {/* Score */}
              <div className="shrink-0 text-right min-w-[60px]">
                <span className={`font-bold font-mono ${isTop3 ? "text-xl text-primary" : "text-base"}`}>
                  {entry.score.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Unsubmitted teams */}
        {unsubmittedTeams.map((team) => (
          <div
            key={`unsubmitted-${team.teamCode}`}
            className="flex items-center gap-4 p-4 rounded-2xl border border-dashed opacity-50"
          >
            <div className="shrink-0 w-10 text-center">
              <span className="text-sm text-muted-foreground">-</span>
            </div>
            <div className="shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{team.name}</p>
            </div>
            <Badge variant="destructive" className="text-xs shrink-0">
              미제출
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
