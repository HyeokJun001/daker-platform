import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HackathonDetail } from "@/lib/types";

export default function TabOverview({ detail }: { detail: HackathonDetail }) {
  const { overview } = detail.sections;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>개요</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {overview.summary}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>팀 구성 정책</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {overview.teamPolicy.allowSolo ? "개인 참가 가능" : "팀 필수"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                최대 {overview.teamPolicy.maxTeamSize}인
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
