"use client";

interface FitScoreGaugeProps {
  score: number;
  size?: number;
}

export default function FitScoreGauge({ score, size = 120 }: FitScoreGaugeProps) {
  const color =
    score >= 70
      ? "oklch(0.696 0.17 162.48)" // emerald
      : score >= 40
      ? "oklch(0.795 0.184 86.047)" // amber
      : "oklch(0.637 0.237 25.331)"; // red

  const bgColor = "oklch(0.922 0 0)";
  const gradient = `conic-gradient(${color} ${score * 3.6}deg, ${bgColor} ${score * 3.6}deg)`;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: gradient,
        }}
      >
        <div
          className="rounded-full bg-background flex items-center justify-center"
          style={{
            width: size - 16,
            height: size - 16,
          }}
        >
          <div className="text-center">
            <span className="text-2xl font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground block">%</span>
          </div>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        {score >= 70 ? "적합" : score >= 40 ? "보통" : "보강 필요"}
      </span>
    </div>
  );
}
