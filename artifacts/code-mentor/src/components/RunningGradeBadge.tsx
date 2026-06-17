import { Award, Lightbulb, TrendingUp } from "lucide-react";
import { RunningGradeInfo } from "@/lib/runningGrade";
import { GRADE_DESCRIPTIONS } from "@/data/methodology";

export function RunningGradeBadge({
  info,
  totalRounds,
  variant = "card",
}: {
  info: RunningGradeInfo;
  totalRounds: number;
  variant?: "card" | "chip";
}) {
  const desc = GRADE_DESCRIPTIONS[info.grade];

  const gradeColor =
    info.grade >= 10
      ? "from-emerald-500 to-emerald-600"
      : info.grade >= 7
        ? "from-primary to-accent"
        : info.grade >= 4
          ? "from-amber-500 to-orange-500"
          : "from-rose-500 to-red-600";

  if (variant === "chip") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-mono px-2 py-0.5 rounded text-white bg-gradient-to-r ${gradeColor}`}
        title={`Текущая оценка по ${info.completedRounds}/${totalRounds} раундам`}
        data-testid="running-grade-chip"
      >
        <Award className="h-3 w-3" />
        <span className="text-xs font-bold">{info.grade}/12</span>
      </span>
    );
  }

  return (
    <div
      className="rounded-2xl border bg-card overflow-hidden"
      data-testid="running-grade-card"
    >
      <div
        className={`bg-gradient-to-br ${gradeColor} p-5 text-white flex items-center gap-5`}
      >
        <Award className="h-10 w-10 opacity-90 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-widest opacity-80">
            Твоя текущая оценка
          </div>
          <div className="text-xs opacity-80 mt-0.5">
            по {info.completedRounds} из {totalRounds} раундов
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold font-mono leading-none">
            {info.grade}
            <span className="text-xl opacity-60 font-normal"> / 12</span>
          </div>
          <div className="text-[11px] opacity-80 mt-1">{desc.label}</div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-accent flex-shrink-0" />
          <div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Точность
            </div>
            <div className="font-mono font-bold">{info.rawPct.toFixed(0)}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
          <div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Подсказок
            </div>
            <div className="font-mono font-bold">{info.hintsRevealed}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <div>
            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">
              Баллов
            </div>
            <div className="font-mono font-bold">
              {info.earned.toFixed(0)}/{info.max}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
