import { Round, TOTAL_ROUNDS } from "@/data/curriculum";
import { RoundResult } from "@/components/RoundView";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Sparkles, Lightbulb, Clock, Home } from "lucide-react";
import { RunningGradeBadge } from "@/components/RunningGradeBadge";
import { RunningGradeInfo } from "@/lib/runningGrade";
import { RoundReportModal } from "@/components/RoundReportModal";

export function RoundSummary({
  round,
  result,
  isLast,
  onNext,
  onHome,
  totalRounds = TOTAL_ROUNDS,
  runningGrade,
}: {
  round: Round;
  result: RoundResult;
  isLast: boolean;
  onNext: () => void;
  onHome?: () => void;
  totalRounds?: number;
  runningGrade?: RunningGradeInfo | null;
}) {
  const pct = result.max > 0 ? (result.earned / result.max) * 100 : 0;
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;

  const breakdown = {
    fill: result.perExercise.filter((r) => r.type === "fill"),
    question: result.perExercise.filter((r) => r.type === "question"),
    write: result.perExercise.filter((r) => r.type === "write"),
    fillLines: result.perExercise.filter((r) => r.type === "fill-lines"),
  };

  const minutes = result.durationMs ? Math.max(1, Math.round(result.durationMs / 60000)) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {onHome && (
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
              data-testid="button-home-summary"
            >
              <Home className="h-3.5 w-3.5" />
              На главную
            </Button>
          </div>
        )}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Раунд {round.number} завершён
          </div>
          <h1 className="text-4xl font-bold mb-3">{round.title}</h1>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[0, 1, 2].map((i) => (
              <Sparkles
                key={i}
                className={`h-6 w-6 ${
                  i < stars ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <div className="text-3xl font-bold font-mono">
            {result.earned} <span className="text-muted-foreground text-xl">/ {result.max}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {pct.toFixed(0)}% от максимума
          </div>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            {minutes !== null && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> {minutes} мин
              </div>
            )}
            {result.hintsRevealed > 0 && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-3 w-3" /> {result.hintsRevealed} подсказок открыто
              </div>
            )}
          </div>
        </div>

        <div className={`grid ${breakdown.fillLines.length > 0 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"} gap-3 mb-6`}>
          {[
            { label: "Заполнение", color: "primary", items: breakdown.fill },
            { label: "Вопросы", color: "accent", items: breakdown.question },
            { label: "С нуля", color: "emerald", items: breakdown.write },
            ...(breakdown.fillLines.length > 0
              ? [{ label: "Блоки кода", color: "fuchsia", items: breakdown.fillLines }]
              : []),
          ].map((g) => {
            const earned = g.items.reduce((a, r) => a + r.earned, 0);
            const max = g.items.reduce((a, r) => a + r.max, 0);
            return (
              <div
                key={g.label}
                className="rounded-lg border bg-card p-4 text-center"
              >
                <div className="text-xs text-muted-foreground mb-1">{g.label}</div>
                <div className="text-2xl font-bold font-mono">{earned}</div>
                <div className="text-xs text-muted-foreground">из {max}</div>
              </div>
            );
          })}
        </div>

        {/* Round report modal */}
        <div className="mb-6">
          <RoundReportModal
            round={round}
            perExercise={result.perExercise}
            earned={result.earned}
            max={result.max}
            durationMs={result.durationMs}
            trigger={
              <Button variant="outline" className="w-full gap-2 h-10">
                <Trophy className="h-3.5 w-3.5" />
                Посмотреть детали и скачать результаты раунда
              </Button>
            }
          />
        </div>

        {runningGrade && (
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 px-1">
              Твоя текущая оценка с учётом этого раунда
            </div>
            <RunningGradeBadge info={runningGrade} totalRounds={totalRounds} />
            <div className="text-[11px] text-muted-foreground mt-2 px-1 leading-relaxed">
              Считается по всем зачётным раундам (пропущенные через админ-режим
              в расчёт не идут). Эта же формула используется на финальном экране — так
              ты в любой момент видишь, к какому итогу идёшь.
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-muted/30 p-4 mb-8 text-sm">
          <div className="font-medium mb-2">Что дальше:</div>
          <div className="text-muted-foreground leading-relaxed">
            {isLast
              ? `Это был последний раунд (${totalRounds}/${totalRounds})! На следующем экране — твоя итоговая оценка от 1 до 12 за все ${totalRounds} раундов и финальное задание для учителя.`
              : `Раунд ${round.number + 1} из ${totalRounds} продолжит то, что мы изучали. Сложность вырастет — но и твои навыки тоже.`}
          </div>
        </div>

        <Button size="lg" onClick={onNext} className="w-full h-12 text-base" data-testid="button-next-round">
          {isLast ? "Посмотреть итоговую оценку" : `К раунду ${round.number + 1}`}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
