// ===== Hackathon List =====
export interface Hackathon {
  slug: string;
  title: string;
  status: "ended" | "ongoing" | "upcoming";
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

// ===== Hackathon Detail =====
export interface Milestone {
  name: string;
  at: string;
}

export interface PrizeItem {
  place: string;
  amountKRW: number;
}

export interface ScoreBreakdownDef {
  key: string;
  label: string;
  weightPercent: number;
}

export interface SubmissionItem {
  key: string;
  title: string;
  format: string;
}

export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview: {
      summary: string;
      teamPolicy: {
        allowSolo: boolean;
        maxTeamSize: number;
      };
    };
    info: {
      notice: string[];
      links: {
        rules: string;
        faq: string;
      };
    };
    eval: {
      metricName: string;
      description: string;
      limits?: {
        maxRuntimeSec: number;
        maxSubmissionsPerDay: number;
      };
      scoreSource?: string;
      scoreDisplay?: {
        label: string;
        breakdown: ScoreBreakdownDef[];
      };
    };
    schedule: {
      timezone: string;
      milestones: Milestone[];
    };
    prize: {
      items: PrizeItem[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: SubmissionItem[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

// ===== Leaderboard =====
export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: Record<string, number>;
  artifacts?: {
    webUrl?: string;
    pdfUrl?: string;
    planTitle?: string;
  };
}

export interface LeaderboardData {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

// ===== Team =====
export interface Team {
  teamCode: string;
  hackathonSlug: string;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: {
    type: string;
    url: string;
  };
  createdAt: string;
}

// ===== Submission (user-created) =====
export interface Submission {
  id: string;
  hackathonSlug: string;
  itemKey?: string; // for multi-step submissions
  title: string;
  content: string; // URL or text
  notes?: string;
  submittedAt: string;
  status: "draft" | "submitted";
}
