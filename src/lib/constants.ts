export const ROUTES = {
  HOME: "/",
  HACKATHONS: "/hackathons",
  HACKATHON_DETAIL: (slug: string) => `/hackathons/${slug}`,
  RANKINGS: "/rankings",
  CAMP: "/camp",
} as const;

export const STATUS_LABELS: Record<string, string> = {
  ended: "종료",
  ongoing: "진행중",
  upcoming: "예정",
};

export const STATUS_COLORS: Record<string, string> = {
  ended: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  ongoing: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export const NAV_ITEMS = [
  { href: "/", label: "메인" },
  { href: "/hackathons", label: "해커톤" },
  { href: "/camp", label: "캠프" },
  { href: "/rankings", label: "랭킹" },
] as const;

export const STORAGE_KEYS = {
  HACKATHONS: "daker_hackathons",
  DETAILS: "daker_details",
  TEAMS: "daker_teams",
  LEADERBOARDS: "daker_leaderboards",
  SUBMISSIONS: "daker_submissions",
  BOOKMARKS: "daker_bookmarks",
  DATA_VERSION: "daker_data_version",
} as const;

export const CURRENT_DATA_VERSION = "1.1.0";
