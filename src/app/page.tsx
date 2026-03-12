"use client";

import Link from "next/link";
import { useHackathonStore } from "@/stores/hackathonStore";
import { useTeamStore } from "@/stores/teamStore";
import { useLeaderboardStore } from "@/stores/leaderboardStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants";
import CountdownTimer from "@/components/shared/CountdownTimer";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const hackathons = useHackathonStore((s) => s.hackathons);
  const teams = useTeamStore((s) => s.teams);
  const leaderboards = useLeaderboardStore((s) => s.leaderboards);

  const totalParticipants = leaderboards.reduce(
    (sum, lb) => sum + lb.entries.length,
    0
  );

  const ongoingHackathons = hackathons.filter((h) => h.status === "ongoing" || h.status === "upcoming");

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-primary">DAKER</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            해커톤 탐색부터 팀 빌딩, 제출, 랭킹까지
            <br />한 곳에서 관리하는 원스톱 플랫폼
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" render={<Link href="/hackathons" />}>
              해커톤 둘러보기
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/camp" />}>
              팀 찾기
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <StatCard label="해커톤" value={hackathons.length} />
          <StatCard label="팀" value={teams.length} />
          <StatCard label="참가 기록" value={totalParticipants} />
        </div>
      </section>

      {/* Quick Links */}
      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-center mb-8">빠른 탐색</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/hackathons">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">해커톤 모아보기</h3>
                <p className="text-sm text-muted-foreground">
                  진행중인 해커톤을 탐색하고 참가하세요
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/camp">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">팀 찾기</h3>
                <p className="text-sm text-muted-foreground">
                  함께할 팀원을 찾거나 새 팀을 만드세요
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/rankings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">랭킹 보기</h3>
                <p className="text-sm text-muted-foreground">
                  전체 해커톤 순위를 확인하세요
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Ongoing/Upcoming Hackathons */}
      {ongoingHackathons.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-8">진행중/예정 해커톤</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ongoingHackathons.map((h) => (
              <Link key={h.slug} href={`/hackathons/${h.slug}`} className="h-full">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold line-clamp-2">{h.title}</h3>
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[h.status]}
                      >
                        {STATUS_LABELS[h.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {h.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>마감: {new Date(h.period.submissionDeadlineAt).toLocaleDateString("ko-KR")}</span>
                      <CountdownTimer targetDate={h.period.submissionDeadlineAt} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
