import type { UserProfile, ChatMessage } from "@/stores/ahaStore";
import type { HackathonDetail } from "@/lib/types";
import type { Team } from "@/lib/types";

// Skill keyword mapping: tag/category -> related skills
const SKILL_MAP: Record<string, string[]> = {
  AI: ["Python", "TensorFlow", "PyTorch", "ML", "Deep Learning", "NLP", "Computer Vision"],
  "머신러닝": ["Python", "Scikit-learn", "TensorFlow", "PyTorch", "ML"],
  "딥러닝": ["Python", "TensorFlow", "PyTorch", "Deep Learning"],
  "데이터": ["Python", "Pandas", "SQL", "R", "데이터분석", "Spark"],
  "데이터분석": ["Python", "Pandas", "SQL", "R", "Tableau"],
  웹: ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js"],
  프론트엔드: ["React", "Next.js", "Vue", "JavaScript", "TypeScript", "HTML", "CSS"],
  백엔드: ["Node.js", "Python", "Java", "Go", "Spring", "Express", "FastAPI"],
  모바일: ["Flutter", "React Native", "Swift", "Kotlin"],
  블록체인: ["Solidity", "Web3", "Smart Contract", "Ethereum"],
  클라우드: ["AWS", "GCP", "Azure", "Docker", "Kubernetes"],
  "바이브코딩": ["JavaScript", "TypeScript", "React", "Next.js", "AI", "프롬프트엔지니어링"],
  NLP: ["Python", "NLP", "Transformers", "BERT", "GPT"],
  "컴퓨터비전": ["Python", "OpenCV", "CNN", "Computer Vision"],
  IoT: ["Arduino", "Raspberry Pi", "C", "Python", "센서"],
  게임: ["Unity", "C#", "Unreal", "C++"],
};

const EXPERIENCE_WEIGHT: Record<string, number> = {
  beginner: 0.7,
  intermediate: 0.9,
  advanced: 1.0,
};

// Learning recommendations per skill
const LEARNING_TIPS: Record<string, string> = {
  Python: "Python 공식 문서와 Codecademy 무료 강좌를 추천합니다",
  React: "React 공식 튜토리얼(react.dev)로 시작하세요",
  "Next.js": "Next.js Learn(nextjs.org/learn)에서 단계별 학습이 가능합니다",
  TensorFlow: "TensorFlow 공식 튜토리얼과 Google ML Crash Course를 추천합니다",
  PyTorch: "PyTorch 공식 튜토리얼(pytorch.org/tutorials)을 참고하세요",
  TypeScript: "TypeScript Handbook(typescriptlang.org)으로 시작하세요",
  "Node.js": "Node.js 공식 가이드와 freeCodeCamp 강좌를 추천합니다",
  Docker: "Docker Docs의 Get Started 가이드를 추천합니다",
  SQL: "SQLBolt(sqlbolt.com)에서 인터랙티브하게 학습하세요",
  ML: "Andrew Ng의 Machine Learning 강좌(Coursera)를 추천합니다",
  "Deep Learning": "fast.ai 무료 강좌로 실전 딥러닝을 배워보세요",
  Pandas: "Kaggle Learn의 Pandas 과정을 추천합니다",
  AWS: "AWS Free Tier와 공식 트레이닝을 활용하세요",
};

/**
 * Extract required skills from hackathon detail
 */
export function extractRequiredSkills(detail: HackathonDetail): string[] {
  const skills = new Set<string>();

  // From title keywords
  const titleText = detail.title || "";
  Object.entries(SKILL_MAP).forEach(([key, vals]) => {
    if (titleText.includes(key)) {
      vals.forEach((s) => skills.add(s));
    }
  });

  // From eval section keywords
  const evalText = [
    detail.sections.eval.metricName,
    detail.sections.eval.description,
  ].join(" ");

  Object.entries(SKILL_MAP).forEach(([key, vals]) => {
    if (evalText.includes(key)) {
      vals.forEach((s) => skills.add(s));
    }
  });

  // From overview
  const summary = detail.sections.overview.summary || "";
  Object.entries(SKILL_MAP).forEach(([key, vals]) => {
    if (summary.includes(key)) {
      vals.forEach((s) => skills.add(s));
    }
  });

  return Array.from(skills);
}

/**
 * Calculate fit score between user profile and hackathon
 */
export function calculateFitScore(
  profile: UserProfile,
  requiredSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  if (requiredSkills.length === 0) {
    return { score: 85, matched: profile.skills, missing: [] };
  }

  const userSkillsLower = new Set(profile.skills.map((s) => s.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  requiredSkills.forEach((skill) => {
    if (userSkillsLower.has(skill.toLowerCase())) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const rawScore = (matched.length / requiredSkills.length) * 100;
  const weightedScore = rawScore * EXPERIENCE_WEIGHT[profile.experience];
  const score = Math.min(100, Math.round(weightedScore));

  return { score, matched, missing };
}

/**
 * Get learning recommendations for missing skills
 */
export function getRecommendations(missingSkills: string[]): string[] {
  return missingSkills.slice(0, 5).map((skill) => {
    const tip = LEARNING_TIPS[skill];
    return tip
      ? `**${skill}**: ${tip}`
      : `**${skill}**: 관련 공식 문서와 온라인 강좌를 검색해보세요`;
  });
}

/**
 * Find matching teams from camp
 */
export function findMatchingTeams(
  profile: UserProfile,
  teams: Team[],
  hackathonSlug: string
): Team[] {
  const userSkillsLower = new Set(profile.skills.map((s) => s.toLowerCase()));

  return teams
    .filter((t) => t.hackathonSlug === hackathonSlug && t.isOpen)
    .filter((t) =>
      t.lookingFor.some(
        (role) =>
          userSkillsLower.has(role.toLowerCase()) ||
          profile.interests.some(
            (interest) => interest.toLowerCase() === role.toLowerCase()
          )
      )
    )
    .slice(0, 3);
}

/**
 * Generate bot response based on user message
 */
export function generateResponse(
  userMessage: string,
  profile: UserProfile,
  detail: HackathonDetail,
  teams: Team[]
): ChatMessage {
  const requiredSkills = extractRequiredSkills(detail);
  const { score, matched, missing } = calculateFitScore(profile, requiredSkills);
  const msg = userMessage.toLowerCase();

  let content: string;
  let metadata: ChatMessage["metadata"] = {};

  if (
    msg.includes("적합") ||
    msg.includes("맞는") ||
    msg.includes("fit") ||
    msg.includes("분석") ||
    msg.includes("확인")
  ) {
    // Fit score analysis
    metadata = { fitScore: score, missingSkills: missing };
    content = `이 해커톤에 대한 적합도를 분석했어요!\n\n` +
      `적합도: **${score}%**\n\n` +
      `매칭된 기술 (${matched.length}개): ${matched.join(", ") || "없음"}\n` +
      `부족한 기술 (${missing.length}개): ${missing.join(", ") || "없음"}\n\n` +
      (score >= 80
        ? "훌륭합니다! 이 해커톤에 충분히 참가할 수 있어요."
        : score >= 50
        ? "준비가 어느 정도 되어있네요! 부족한 기술을 보완하면 더 좋은 결과를 얻을 수 있어요."
        : "기술 스택 보강이 필요하지만, 도전하는 것 자체가 성장의 기회입니다!");
  } else if (
    msg.includes("부족") ||
    msg.includes("gap") ||
    msg.includes("배워") ||
    msg.includes("추천") ||
    msg.includes("학습")
  ) {
    // Skill gap recommendations
    const recs = getRecommendations(missing);
    metadata = { missingSkills: missing, recommendations: recs };

    if (missing.length === 0) {
      content = "축하합니다! 이 해커톤에 필요한 모든 기술을 보유하고 있어요. 바로 참가해보세요!";
    } else {
      content =
        `이 해커톤에서 보완하면 좋을 기술들이에요:\n\n` +
        recs.join("\n\n") +
        `\n\n이 기술들을 익히면 적합도를 더 높일 수 있어요!`;
    }
  } else if (
    msg.includes("팀") ||
    msg.includes("team") ||
    msg.includes("같이") ||
    msg.includes("모집")
  ) {
    // Team matching
    const matchedTeams = findMatchingTeams(profile, teams, detail.slug);

    if (matchedTeams.length > 0) {
      content =
        `기술 스택과 맞는 팀을 찾았어요!\n\n` +
        matchedTeams
          .map(
            (t) =>
              `**${t.name}** - 찾는 포지션: ${t.lookingFor.join(", ")} (${t.memberCount}명)`
          )
          .join("\n") +
        `\n\n캠프 페이지에서 더 많은 팀을 확인할 수 있어요.`;
    } else {
      content =
        "현재 이 해커톤에서 기술 스택과 딱 맞는 모집 중인 팀은 없어요. " +
        "직접 팀을 만들어보는 건 어떨까요? 캠프 페이지에서 팀을 생성할 수 있어요!";
    }
  } else if (msg.includes("안녕") || msg.includes("hello") || msg.includes("hi")) {
    content =
      `안녕하세요! 저는 AHA, AI 해커톤 어드바이저예요. ` +
      `**${detail.title}** 해커톤에 대해 도움을 드릴 수 있어요.\n\n` +
      `무엇이 궁금하신가요?\n` +
      `- "적합도 분석" - 나의 기술 매칭 분석\n` +
      `- "부족한 기술" - 스킬 갭 및 학습 추천\n` +
      `- "팀 찾기" - 기술 기반 팀 매칭`;
  } else {
    // Default response
    metadata = { fitScore: score };
    content =
      `도움을 드릴 수 있는 것들이에요:\n\n` +
      `- **"적합도 분석"** - 이 해커톤과의 기술 매칭도를 분석해요\n` +
      `- **"부족한 기술 추천"** - 보완하면 좋은 기술과 학습 방법을 알려드려요\n` +
      `- **"팀 찾기"** - 기술 스택에 맞는 팀을 추천해요\n\n` +
      `현재 적합도: **${score}%**`;
  }

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    metadata,
  };
}
