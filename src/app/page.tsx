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
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { Sparkles, Users, Trophy, ArrowRight } from "lucide-react";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <AnimatedCounter
        target={value}
        className="text-4xl font-bold text-primary"
      />
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

const CTA_ITEMS = [
  {
    href: "/hackathons",
    icon: Sparkles,
    title: "해커톤 모아보기",
    desc: "진행중인 해커톤을 탐색하고 참가하세요",
    gradient: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
  },
  {
    href: "/camp",
    icon: Users,
    title: "팀 찾기",
    desc: "함께할 팀원을 찾거나 새 팀을 만드세요",
    gradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
  },
  {
    href: "/rankings",
    icon: Trophy,
    title: "랭킹 보기",
    desc: "전체 해커톤 순위를 확인하세요",
    gradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
  },
];

export default function HomePage() {
  const hackathons = useHackathonStore((s) => s.hackathons);
  const teams = useTeamStore((s) => s.teams);
  const leaderboards = useLeaderboardStore((s) => s.leaderboards);

  const totalParticipants = leaderboards.reduce(
    (sum, lb) => sum + lb.entries.length,
    0
  );

  const ongoingHackathons = hackathons.filter(
    (h) => h.status === "ongoing" || h.status === "upcoming"
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5 animate-gradient" />

        {/* Floating decorative elements */}
        <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-float" />
        <div className="absolute bottom-10 right-[15%] w-40 h-40 rounded-full bg-primary/8 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-[60%] w-24 h-24 rounded-full bg-primary/5 blur-2xl animate-float-slow" />

        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              DAKER
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up-delayed">
            해커톤 탐색부터 팀 빌딩, 제출, 랭킹까지
            <br />
            한 곳에서 관리하는 원스톱 플랫폼
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up-delayed-2">
            <Button size="lg" render={<Link href="/hackathons" />}>
              해커톤 둘러보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/camp" />}
            >
              팀 찾기
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <StatCard label="해커톤" value={hackathons.length} />
          <StatCard label="팀" value={teams.length} />
          <StatCard label="참가 기록" value={totalParticipants} />
        </div>
      </section>

      {/* Quick Links - Big CTA Cards */}
      <section className="container mx-auto px-4 pb-14">
        <h2 className="text-2xl font-bold text-center mb-8">빠른 탐색</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {CTA_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 cursor-pointer overflow-hidden">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium">
                    <span>바로가기</span>
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Ongoing/Upcoming Hackathons */}
      {ongoingHackathons.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            진행중/예정 해커톤
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ongoingHackathons.map((h) => (
              <Link
                key={h.slug}
                href={`/hackathons/${h.slug}`}
                className="h-full"
              >
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer h-full">
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
                      <span>
                        마감:{" "}
                        {new Date(
                          h.period.submissionDeadlineAt
                        ).toLocaleDateString("ko-KR")}
                      </span>
                      <CountdownTimer
                        targetDate={h.period.submissionDeadlineAt}
                      />
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
