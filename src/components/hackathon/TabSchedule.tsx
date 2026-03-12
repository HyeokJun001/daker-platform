import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { HackathonDetail } from "@/lib/types";

export default function TabSchedule({ detail }: { detail: HackathonDetail }) {
  const { schedule } = detail.sections;
  const now = new Date();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>일정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

            <div className="space-y-6">
              {schedule.milestones.map((milestone, i) => {
                const milestoneDate = new Date(milestone.at);
                const isPast = milestoneDate < now;
                const isCurrent =
                  i < schedule.milestones.length - 1
                    ? milestoneDate <= now &&
                      new Date(schedule.milestones[i + 1].at) > now
                    : milestoneDate <= now;

                return (
                  <div key={i} className="flex gap-4 relative">
                    {/* Dot */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                        isPast
                          ? "bg-primary border-primary"
                          : isCurrent
                          ? "bg-primary border-primary animate-pulse"
                          : "bg-background border-muted-foreground/30"
                      }`}
                    >
                      {isPast && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-2 ${isPast ? "opacity-60" : ""}`}>
                      <p className={`font-medium text-sm ${isCurrent ? "text-primary" : ""}`}>
                        {milestone.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {milestoneDate.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
