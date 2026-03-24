"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAHAStore, type UserProfile } from "@/stores/ahaStore";

const SKILL_OPTIONS = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js", "Vue",
  "Node.js", "Java", "Go", "C++", "Swift", "Kotlin",
  "TensorFlow", "PyTorch", "ML", "Deep Learning", "NLP",
  "SQL", "Pandas", "Docker", "AWS", "GCP",
  "HTML", "CSS", "Flutter", "React Native",
  "Git", "Linux", "Figma",
];

const INTEREST_OPTIONS = [
  "AI", "웹", "모바일", "데이터", "블록체인", "클라우드", "IoT", "게임", "보안",
];

const EXP_OPTIONS: { value: UserProfile["experience"]; label: string }[] = [
  { value: "beginner", label: "입문 (0-1년)" },
  { value: "intermediate", label: "중급 (1-3년)" },
  { value: "advanced", label: "고급 (3년+)" },
];

export default function AHAProfileSetup({ onComplete }: { onComplete: () => void }) {
  const setProfile = useAHAStore((s) => s.setProfile);
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<UserProfile["experience"]>("intermediate");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    if (skills.length === 0) return;
    setProfile({ skills, experience, interests });
    onComplete();
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto max-h-[400px]">
      <div>
        <h4 className="text-sm font-semibold mb-1">AHA 프로필 설정</h4>
        <p className="text-xs text-muted-foreground">
          기술 스택을 선택하면 해커톤 적합도를 분석해드려요
        </p>
      </div>

      {/* Skills */}
      <div>
        <label className="text-xs font-medium mb-2 block">
          보유 기술 (1개 이상 선택)
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SKILL_OPTIONS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                skills.includes(skill)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className="text-xs font-medium mb-2 block">경험 수준</label>
        <div className="flex gap-2">
          {EXP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setExperience(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                experience === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="text-xs font-medium mb-2 block">관심 분야</label>
        <div className="flex flex-wrap gap-1.5">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                interests.includes(interest)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={skills.length === 0}
      >
        분석 시작
      </Button>
    </div>
  );
}
