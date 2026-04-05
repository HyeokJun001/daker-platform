"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTeamStore } from "@/stores/teamStore";
import { useHackathonStore } from "@/stores/hackathonStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";

function CampContent() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("hackathon") || "all";

  const { teams, addTeam } = useTeamStore();
  const hackathons = useHackathonStore((s) => s.hackathons);
  const [hackathonFilter, setHackathonFilter] = useState(initialFilter);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filtered = useMemo(() => {
    if (hackathonFilter === "all") return teams;
    return teams.filter((t) => t.hackathonSlug === hackathonFilter);
  }, [teams, hackathonFilter]);

  const [newTeam, setNewTeam] = useState({
    name: "",
    hackathonSlug: hackathons[0]?.slug || "",
    lookingFor: "",
    intro: "",
    contactUrl: "",
    isOpen: true,
  });

  const handleCreateTeam = () => {
    if (!newTeam.name.trim() || !newTeam.hackathonSlug) {
      toast.error("팀 이름과 해커톤을 선택해주세요");
      return;
    }

    addTeam({
      teamCode: `T-${Date.now()}`,
      hackathonSlug: newTeam.hackathonSlug,
      name: newTeam.name,
      isOpen: newTeam.isOpen,
      memberCount: 1,
      lookingFor: newTeam.lookingFor
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      intro: newTeam.intro,
      contact: { type: "link", url: newTeam.contactUrl },
      createdAt: new Date().toISOString(),
    });

    toast.success("팀이 생성되었습니다!");
    setShowCreateDialog(false);
    setNewTeam({
      name: "",
      hackathonSlug: hackathons[0]?.slug || "",
      lookingFor: "",
      intro: "",
      contactUrl: "",
      isOpen: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">팀원 모집</h1>
          <p className="text-muted-foreground">
            함께할 팀원을 찾거나 새 팀을 만드세요
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          팀 만들기
        </Button>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 팀 만들기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">팀 이름 *</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam((p) => ({ ...p, name: e.target.value }))}
                  placeholder="팀 이름"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">해커톤 *</label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={newTeam.hackathonSlug}
                  onChange={(e) => setNewTeam((p) => ({ ...p, hackathonSlug: e.target.value }))}
                >
                  {hackathons.map((h) => (
                    <option key={h.slug} value={h.slug}>
                      {h.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  구인 포지션 (쉼표 구분)
                </label>
                <Input
                  value={newTeam.lookingFor}
                  onChange={(e) => setNewTeam((p) => ({ ...p, lookingFor: e.target.value }))}
                  placeholder="Frontend, Backend, Designer"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">팀 소개</label>
                <Textarea
                  value={newTeam.intro}
                  onChange={(e) => setNewTeam((p) => ({ ...p, intro: e.target.value }))}
                  placeholder="팀 소개를 입력하세요"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  연락처 (카카오톡 오픈채팅, 디스코드 등)
                </label>
                <Input
                  value={newTeam.contactUrl}
                  onChange={(e) => setNewTeam((p) => ({ ...p, contactUrl: e.target.value }))}
                  placeholder="https://open.kakao.com/..."
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium">모집 상태</label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={newTeam.isOpen}
                  onClick={() => setNewTeam((p) => ({ ...p, isOpen: !p.isOpen }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    newTeam.isOpen ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
                      newTeam.isOpen ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-muted-foreground">
                  {newTeam.isOpen ? "모집중" : "모집마감"}
                </span>
              </div>
              <Button className="w-full" onClick={handleCreateTeam}>
                팀 생성
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={hackathonFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setHackathonFilter("all")}
        >
          전체
        </Button>
        {hackathons.map((h) => (
          <Button
            key={h.slug}
            variant={hackathonFilter === h.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setHackathonFilter(h.slug)}
          >
            {h.title.length > 20 ? h.title.slice(0, 20) + "..." : h.title}
          </Button>
        ))}
      </div>

      {/* Team List */}
      {filtered.length === 0 ? (
        <EmptyState
          title="등록된 팀이 없습니다"
          description="새 팀을 만들어보세요!"
          actionLabel="팀 만들기"
          onAction={() => setShowCreateDialog(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((team) => (
            <Card key={team.teamCode} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{team.name}</h3>
                  <Badge variant={team.isOpen ? "default" : "secondary"}>
                    {team.isOpen ? "모집중" : "마감"}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {team.intro}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {team.lookingFor.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm pt-3 border-t">
                  <span className="text-muted-foreground">
                    {team.memberCount}명
                  </span>
                  {team.isOpen && team.contact.url && (
                    <a
                      href={team.contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      연락하기
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CampPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-96" />
          </div>
        </div>
      }
    >
      <CampContent />
    </Suspense>
  );
}
