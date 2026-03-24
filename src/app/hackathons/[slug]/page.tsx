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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/hackathons"
          className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          목록으로
        </Link>
        <div className="flex items-start justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {hackathon.title}
            </h1>
            <div className="flex items-center gap-2">
              <StatusBadge status={hackathon.status} />
              <span className="text-sm text-muted-foreground">
                마감:{" "}
                {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </div>
      </div>

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
            <TabOverview detail={detail} />
          </TabsContent>
          <TabsContent value="teams">
            <TabTeams detail={detail} />
          </TabsContent>
          <TabsContent value="eval">
            <TabEval detail={detail} />
          </TabsContent>
          <TabsContent value="prize">
            <TabPrize detail={detail} />
          </TabsContent>
          <TabsContent value="info">
            <TabInfo detail={detail} />
          </TabsContent>
          <TabsContent value="schedule">
            <TabSchedule detail={detail} />
          </TabsContent>
          <TabsContent value="submit">
            <TabSubmit detail={detail} />
          </TabsContent>
          <TabsContent value="leaderboard">
            <TabLeaderboard detail={detail} />
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
  );
}
