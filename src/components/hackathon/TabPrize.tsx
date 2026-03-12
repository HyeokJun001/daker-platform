import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HackathonDetail } from "@/lib/types";
import EmptyState from "@/components/shared/EmptyState";

const PLACE_LABELS: Record<string, string> = {
  "1st": "1등",
  "2nd": "2등",
  "3rd": "3등",
};

const PLACE_ICONS: Record<string, string> = {
  "1st": "🥇",
  "2nd": "🥈",
  "3rd": "🥉",
};

export default function TabPrize({ detail }: { detail: HackathonDetail }) {
  const { prize } = detail.sections;

  if (!prize?.items?.length) {
    return <EmptyState title="상금 정보가 없습니다" />;
  }

  const total = prize.items.reduce((sum, item) => sum + item.amountKRW, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>상금</span>
            <span className="text-sm font-normal text-muted-foreground">
              총 {total.toLocaleString("ko-KR")}원
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prize.items.map((item) => (
              <div
                key={item.place}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {PLACE_ICONS[item.place] || "🏅"}
                  </span>
                  <span className="font-medium">
                    {PLACE_LABELS[item.place] || item.place}
                  </span>
                </div>
                <span className="font-bold text-lg">
                  {item.amountKRW.toLocaleString("ko-KR")}원
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
