"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useHackathonStore } from "@/stores/hackathonStore";
import { useTeamStore } from "@/stores/teamStore";

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const hackathons = useHackathonStore((s) => s.hackathons);
  const teams = useTeamStore((s) => s.teams);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-lg hover:bg-accent transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span>검색...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="해커톤, 팀, 태그를 검색하세요..." />
        <CommandList>
          <CommandEmpty>검색 결과가 없습니다</CommandEmpty>

          <CommandGroup heading="해커톤">
            {hackathons.map((h) => (
              <CommandItem
                key={h.slug}
                value={`${h.title} ${h.tags.join(" ")}`}
                onSelect={() => navigate(`/hackathons/${h.slug}`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                <span>{h.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="팀">
            {teams.map((t) => (
              <CommandItem
                key={t.teamCode}
                value={`${t.name} ${t.lookingFor.join(" ")} ${t.intro}`}
                onSelect={() => navigate(`/camp?hackathon=${t.hackathonSlug}`)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                <span>{t.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {t.lookingFor.join(", ")}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="바로가기">
            <CommandItem onSelect={() => navigate("/")}>
              메인 페이지
            </CommandItem>
            <CommandItem onSelect={() => navigate("/hackathons")}>
              해커톤 목록
            </CommandItem>
            <CommandItem onSelect={() => navigate("/camp")}>
              팀원 모집
            </CommandItem>
            <CommandItem onSelect={() => navigate("/rankings")}>
              랭킹
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
