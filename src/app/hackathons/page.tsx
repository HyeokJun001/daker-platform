"use client";

import { useState, useMemo } from "react";
import { useHackathonStore } from "@/stores/hackathonStore";
import HackathonCard from "@/components/hackathon/HackathonCard";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "ongoing", label: "진행중" },
  { value: "upcoming", label: "예정" },
  { value: "ended", label: "종료" },
];

export default function HackathonsPage() {
  const { hackathons, bookmarks } = useHackathonStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    hackathons.forEach((h) => h.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [hackathons]);

  const filtered = useMemo(() => {
    return hackathons.filter((h) => {
      if (statusFilter !== "all" && h.status !== statusFilter) return false;
      if (selectedTags.length > 0 && !selectedTags.some((t) => h.tags.includes(t)))
        return false;
      if (showBookmarked && !bookmarks.includes(h.slug)) return false;
      return true;
    });
  }, [hackathons, statusFilter, selectedTags, showBookmarked, bookmarks]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">해커톤</h1>
        <p className="text-muted-foreground">
          다양한 해커톤을 탐색하고 참가하세요 · 총 {hackathons.length}개
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        {/* Status Filter - pill style */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === f.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowBookmarked(!showBookmarked)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
              showBookmarked
                ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                : "text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={showBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            북마크
          </button>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕ 초기화
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          title="조건에 맞는 해커톤이 없습니다"
          description="필터 조건을 변경하거나 초기화해보세요"
          actionLabel="필터 초기화"
          onAction={() => {
            setStatusFilter("all");
            setSelectedTags([]);
            setShowBookmarked(false);
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((h) => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
        </div>
      )}
    </div>
  );
}
