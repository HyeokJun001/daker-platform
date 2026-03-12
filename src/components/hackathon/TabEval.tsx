import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HackathonDetail } from "@/lib/types";

export default function TabEval({ detail }: { detail: HackathonDetail }) {
  const { eval: evalSection } = detail.sections;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>평가 기준</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">평가 지표:</span>
              <Badge>{evalSection.metricName}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {evalSection.description}
            </p>
          </div>

          {evalSection.limits && (
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">최대 실행 시간</span>
                <p className="font-medium">{evalSection.limits.maxRuntimeSec}초</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">일일 최대 제출</span>
                <p className="font-medium">{evalSection.limits.maxSubmissionsPerDay}회</p>
              </div>
            </div>
          )}

          {evalSection.scoreDisplay && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">{evalSection.scoreDisplay.label}</h4>
              <div className="space-y-2">
                {evalSection.scoreDisplay.breakdown.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${item.weightPercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-10 text-right">
                        {item.weightPercent}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
