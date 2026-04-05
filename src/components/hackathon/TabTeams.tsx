"use client";

import Link from "next/link";
import { useTeamStore } from "@/stores/teamStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import type { HackathonDetail } from "@/lib/types";
import { toast } from "sonner";
import { UserPlus, LogOut } from "lucide-react";

export default function TabTeams({ detail }: { detail: HackathonDetail }) {
  const teams = useTeamStore((s) => s.teams);
  const joinedTeams = useTeamStore((s) => s.joinedTeams);
  const joinTeam = useTeamStore((s) => s.joinTeam);
  const leaveTeam = useTeamStore((s) => s.leaveTeam);
  const hackathonTeams = teams.filter((t) => t.hackathonSlug === detail.slug);

  const handleJoin = (teamCode: string, teamName: string) => {
    joinTeam(teamCode);
    toast.success(`'${teamName}' 팀에 참가 신청되었습니다!`);
  };

  const handleLeave = (teamCode: string, teamName: string) => {
    leaveTeam(teamCode);
    toast.info(`'${teamName}' 팀에서 탈퇴했습니다.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          참가 팀 ({hackathonTeams.length})
        </h3>
        <Link href={`/camp?hackathon=${detail.slug}`}>
          <Button variant="outline" size="sm">
            캠프에서 팀 찾기
          </Button>
        </Link>
      </div>

      {hackathonTeams.length === 0 ? (
        <EmptyState
          title="등록된 팀이 없습니다"
          description="아직 이 해커톤에 등록된 팀이 없습니다."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {hackathonTeams.map((team) => {
            const isJoined = joinedTeams.includes(team.teamCode);

            return (
              <Card key={team.teamCode}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{team.name}</h4>
                    <Badge variant={team.isOpen ? "default" : "secondary"}>
                      {team.isOpen ? "모집중" : "모집마감"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {team.intro}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{team.memberCount}명</span>
                    {team.lookingFor.length > 0 &&
                      team.lookingFor.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {team.isOpen && !isJoined && (
                      <Button
                        size="sm"
                        onClick={() => handleJoin(team.teamCode, team.name)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        참가 신청
                      </Button>
                    )}
                    {isJoined && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleLeave(team.teamCode, team.name)}
                      >
                        <LogOut className="w-4 h-4 mr-1" />
                        팀 나가기
                      </Button>
                    )}
                    {team.isOpen && (
                      <a
                        href={team.contact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        연락하기
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
