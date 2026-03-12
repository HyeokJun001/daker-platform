import { STORAGE_KEYS, CURRENT_DATA_VERSION } from "./constants";
import type { Hackathon, HackathonDetail, LeaderboardData, Team } from "./types";

interface RawHackathonDetail {
  slug: string;
  title: string;
  sections: HackathonDetail["sections"];
  extraDetails?: Array<{
    slug: string;
    title: string;
    sections: HackathonDetail["sections"];
  }>;
}

interface RawLeaderboard {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardData["entries"];
  extraLeaderboards?: Array<{
    hackathonSlug: string;
    updatedAt: string;
    entries: LeaderboardData["entries"];
  }>;
}

export async function initializeData(): Promise<void> {
  if (typeof window === "undefined") return;

  const currentVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
  if (currentVersion === CURRENT_DATA_VERSION) return;

  try {
    const [hackathonsRes, detailRes, leaderboardRes, teamsRes] =
      await Promise.all([
        fetch("/data/hackathons.json"),
        fetch("/data/hackathon_detail.json"),
        fetch("/data/leaderboard.json"),
        fetch("/data/teams.json"),
      ]);

    const hackathons: Hackathon[] = await hackathonsRes.json();
    const detailRaw: RawHackathonDetail = await detailRes.json();
    const leaderboardRaw: RawLeaderboard = await leaderboardRes.json();
    const teams: Team[] = await teamsRes.json();

    // Flatten hackathon details
    const details: HackathonDetail[] = [
      { slug: detailRaw.slug, title: detailRaw.title, sections: detailRaw.sections },
      ...(detailRaw.extraDetails || []).map((d) => ({
        slug: d.slug,
        title: d.title,
        sections: d.sections,
      })),
    ];

    // Flatten leaderboards
    const leaderboards: LeaderboardData[] = [
      {
        hackathonSlug: leaderboardRaw.hackathonSlug,
        updatedAt: leaderboardRaw.updatedAt,
        entries: leaderboardRaw.entries,
      },
      ...(leaderboardRaw.extraLeaderboards || []).map((lb) => ({
        hackathonSlug: lb.hackathonSlug,
        updatedAt: lb.updatedAt,
        entries: lb.entries,
      })),
    ];

    localStorage.setItem(STORAGE_KEYS.HACKATHONS, JSON.stringify(hackathons));
    localStorage.setItem(STORAGE_KEYS.DETAILS, JSON.stringify(details));
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    localStorage.setItem(STORAGE_KEYS.LEADERBOARDS, JSON.stringify(leaderboards));

    // Only initialize submissions/bookmarks if not already present
    if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
    }

    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
}
