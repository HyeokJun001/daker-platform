"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useHackathonStore } from "@/stores/hackathonStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/shared/EmptyState";
import TabOverview from "@/components/hackathon/TabOverview";
import TabTeams from "@/components/hackathon/TabTeams";
import TabEval from "@/components/hackathon/TabEval";
import TabPrize from "@/components/hackathon/TabPrize";
import TabInfo from "@/components/hackathon/TabInfo";
import TabSchedule from "@/components/hackathon/TabSchedule";
import TabSubmit from "@/components/hackathon/TabSubmit";
import TabLeaderboard from "@/components/hackathon/TabLeaderboard";
import StatusBadge from "@/components/hackathon/StatusBadge";
import AHAChatButton from "@/components/aha/AHAChatButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

class TabErrorBoundary extends React.Component<
  { children: React.ReactNode; name: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; name: string }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-sm">이 탭을 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-sm text-primary hover:underline"
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const TABS = [
  { value: "overview", label: "개요" },
  { value: "teams", label: "팀" },
  { value: "eval", label: "평가" },
  { value: "prize", label: "상금" },
  { value: "info", label: "안내" },
  { value: "schedule", label: "일정" },
  { value: "submit", label: "제출" },
  { value: "leaderboard", label: "리더보드" },
];

export default function HackathonDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const hackathons = useHackathonStore((s) => s.hackathons);
  const details = useHackathonStore((s) => s.details);

  const hackathon = hackathons.find((h) => h.slug === slug);
  const detail = details.find((d) => d.slug === slug);

  const [activeTab, setActiveTab] = useState("overview");

  // Read hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && TABS.some((t) => t.value === hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update hash on tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.replaceState(null, "", `#${value}`);
  };

  if (!hackathon) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          title="해커톤을 찾을 수 없습니다"
          description="요청하신 해커톤이 존재하지 않거나 삭제되었습니다."
          actionLabel="목록으로 돌아가기"
          onAction={() => (window.location.href = "/hackathons")}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="container mx-auto px-4 py-8 relative">
          <Link
            href="/hackathons"
            className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            목록으로
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-3 mb-3">
            {hackathon.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={hackathon.status} />
            <span className="text-sm text-muted-foreground">
              마감: {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString("ko-KR")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hackathon.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/10 text-xs font-medium text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

      {/* Tabs */}
      {detail ? (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="whitespace-nowrap">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <TabErrorBoundary name="overview"><TabOverview detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="teams">
            <TabErrorBoundary name="teams"><TabTeams detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="eval">
            <TabErrorBoundary name="eval"><TabEval detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="prize">
            <TabErrorBoundary name="prize"><TabPrize detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="info">
            <TabErrorBoundary name="info"><TabInfo detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="schedule">
            <TabErrorBoundary name="schedule"><TabSchedule detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="submit">
            <TabErrorBoundary name="submit"><TabSubmit detail={detail} /></TabErrorBoundary>
          </TabsContent>
          <TabsContent value="leaderboard">
            <TabErrorBoundary name="leaderboard"><TabLeaderboard detail={detail} /></TabErrorBoundary>
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState
          title="상세 정보가 없습니다"
          description="이 해커톤의 상세 정보가 아직 등록되지 않았습니다."
        />
      )}

      {/* AHA Chatbot */}
      {detail && <AHAChatButton detail={detail} />}
      </div>
    </div>
  );
}
