"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { useHackathonStore } from "@/stores/hackathonStore";
import type { Hackathon } from "@/lib/types";

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const { bookmarks, toggleBookmark } = useHackathonStore();
  const isBookmarked = bookmarks.includes(hackathon.slug);

  return (
    <Card className="hover:shadow-lg transition-all group relative">
      {/* Bookmark button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(hackathon.slug);
        }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full hover:bg-accent transition-colors"
        aria-label={isBookmarked ? "북마크 해제" : "북마크"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isBookmarked ? "text-red-500" : "text-muted-foreground"}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      <Link href={`/hackathons/${hackathon.slug}`}>
        <CardContent className="pt-6">
          {/* Thumbnail placeholder */}
          <div className="w-full h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 mb-4 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary/40">
              {hackathon.title.charAt(0)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors">
              {hackathon.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <StatusBadge status={hackathon.status} />
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {hackathon.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>
              마감:{" "}
              {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString("ko-KR")}
            </span>
            {(hackathon.status === "ongoing" || hackathon.status === "upcoming") && (
              <CountdownTimer targetDate={hackathon.period.submissionDeadlineAt} />
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
