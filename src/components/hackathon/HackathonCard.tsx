"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { useHackathonStore } from "@/stores/hackathonStore";
import type { Hackathon } from "@/lib/types";
import { Heart, ArrowRight } from "lucide-react";

const THUMBNAIL_GRADIENTS = [
  "from-blue-400/30 via-indigo-300/20 to-purple-400/30",
  "from-emerald-400/30 via-teal-300/20 to-cyan-400/30",
  "from-orange-400/30 via-amber-300/20 to-yellow-400/30",
  "from-pink-400/30 via-rose-300/20 to-red-400/30",
  "from-violet-400/30 via-purple-300/20 to-fuchsia-400/30",
];

export default function HackathonCard({ hackathon }: { hackathon: Hackathon }) {
  const { bookmarks, toggleBookmark } = useHackathonStore();
  const isBookmarked = bookmarks.includes(hackathon.slug);
  const gradientIdx = hackathon.slug.length % THUMBNAIL_GRADIENTS.length;
  const isActive = hackathon.status === "ongoing" || hackathon.status === "upcoming";

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border-transparent hover:border-primary/20">
      <Link href={`/hackathons/${hackathon.slug}`}>
        <CardContent className="p-0">
          {/* Thumbnail */}
          <div className={`relative w-full h-40 bg-gradient-to-br ${THUMBNAIL_GRADIENTS[gradientIdx]} flex items-center justify-center overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/10 blur-lg" />

            <span className="text-4xl font-black text-primary/20 tracking-wider">
              {hackathon.title.slice(0, 2).toUpperCase()}
            </span>

            {/* Status overlay */}
            <div className="absolute top-3 left-3">
              <StatusBadge status={hackathon.status} />
            </div>

            {/* Countdown overlay */}
            {isActive && (
              <div className="absolute top-3 right-12 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1">
                <CountdownTimer targetDate={hackathon.period.submissionDeadlineAt} />
              </div>
            )}

            {/* Bookmark button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(hackathon.slug);
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              aria-label={isBookmarked ? "북마크 해제" : "북마크"}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isBookmarked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                }`}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-sm line-clamp-2 mb-3 group-hover:text-primary transition-colors leading-snug min-h-[2.5rem]">
              {hackathon.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {hackathon.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {hackathon.tags.length > 4 && (
                <span className="text-[11px] text-muted-foreground">
                  +{hackathon.tags.length - 4}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">
                마감: {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString("ko-KR")}
              </span>
              <span className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                상세보기 <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
