import { Button } from "@/components/ui/button";
import { GRADE_DESCRIPTIONS } from "@/data/methodology";
import { RoundResult } from "@/components/RoundView";
import { ROUNDS as DEFAULT_ROUNDS, TOTAL_ROUNDS as DEFAULT_TOTAL_ROUNDS, Round } from "@/data/curriculum";
import { Award, ArrowRight, RotateCcw, Lightbulb, Clock, TrendingUp, Trophy, FastForward, CheckCircle2 } from "lucide-react";
import { FinalReportDownloadButton } from "@/components/RoundReportModal";

export function computeHintPenalty(hintsRevealed: number) {
  return Math.min(0.25, 0.005 * Math.max(0, hintsRevealed));
}

export function computeGrade(totalEarned: number, totalMax: number, hintsRevealed = 0): number {
  if (totalMax === 0) return 1;
  const penaltyFactor = computeHintPenalty(hintsRevealed);
  const adjusted = totalEarned * (1 - penaltyFactor);
  const pct = adjusted / totalMax;
  const raw = Math.round(pct * 12);
  return Math.max(1, Math.min(12, raw));
}

function formatMinutes(ms: number) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m === 0) return `${s} сек`;
  return `${m} мин ${s.toString().padStart(2, "0")} сек`;
}

export function Results({
  perRound,
  onContinue,
  onRestart,
  rounds = DEFAULT_ROUNDS,
  totalRounds = DEFAULT_TOTAL_ROUNDS,
  courseLabel,
  continueLabel,
  hideContinue,
}: {
  perRound: RoundResult[];
  onContinue: () => void;
  onRestart: () => void;
  rounds?: Round[];
  totalRounds?: number;
  courseLabel?: string;
  continueLabel?: string;
  hideContinue?: boolean;
}) {
  const graded = perRound.filter((r) => r && r.max > 0 && !r.skipped);
  const totalEarned = graded.reduce((a, r) => a + r.earned, 0);
  const totalMax = graded.reduce((a, r) => a + r.max, 0);
  const totalHints = graded.reduce((a, r) => a + (r?.hintsRevealed ?? 0), 0);
  const totalDuration = graded.reduce((a, r) => a + (r?.durationMs ?? 0), 0);
  const skippedCount = perRound.filter((r) => r && r.skipped).length;

  const penaltyFactor = computeHintPenalty(totalHints);
  const adjustedEarned = totalEarned * (1 - penaltyFactor);
  const grade = computeGrade(totalEarned, totalMax, totalHints);
  const desc = GRADE_DESCRIPTIONS[grade];
  const rawPct = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
  const adjustedPct = totalMax > 0 ? (adjustedEarned / totalMax) * 100 : 0;

  const roundPercents = perRound.map((r) =>
    r && r.max > 0 && !r.skipped ? (r.earned / r.max) * 100 : -1,
  );
  const playedIndices = roundPercents
    .map((v, i) => (v >= 0 ? i : -1))
    .filter((i) => i >= 0);
  const bestIdx = playedIndices.reduce(
    (best, i) => (roundPercents[i] > roundPercents[best] ? i : best),
    playedIndices[0] ?? -1,
  );
  const worstIdx = playedIndices.reduce(
    (worst, i) => (roundPercents[i] < roundPercents[worst] ? i : worst),
    playedIndices[0] ?? -1,
  );

  const gradeColor =
    grade >= 10
      ? "from-emerald-500 to-emerald-600"
      : grade >= 7
        ? "from-primary to-accent"
        : grade >= 4
          ? "from-amber-500 to-orange-500"
          : "from-rose-500 to-red-600";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            {courseLabel ?? "Курс завершён"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Твой результат</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Все {totalRounds} раундов пройдены. Вот твоя итоговая оценка за весь курс.
          </p>
          {skippedCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
              <FastForward className="h-3.5 w-3.5" />
              {skippedCount} {skippedCount === 1 ? "раунд пропущен" : "раунд(ов) пропущено"} в админ-режиме — не учитываются в оценке
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden mb-8">
          <div className={`bg-gradient-to-br ${gradeColor} p-8 text-white text-center`}>
            <Award className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <div className="text-sm uppercase tracking-widest opacity-80 mb-2">
              Итоговая оценка за {totalRounds - skippedCount} зачётных раундов
              {skippedCount > 0 ? ` (из ${totalRounds})` : ""}
            </div>
            <div className="text-8xl font-bold font-mono leading-none mb-2" data-testid="grade-value">
              {grade}
              <span className="text-3xl opacity-60 font-normal"> / 12</span>
            </div>
            <div className="text-xl font-semibold mt-3">{desc.label}</div>
          </div>
          <div className="p-6">
            <p className="text-base leading-relaxed text-foreground/90">{desc.comment}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="surface-card rounded-xl p-4 text-center">
            <Trophy className="h-4 w-4 text-primary mx-auto mb-1.5" />
            <div className="text-2xl font-bold font-mono">
              {totalEarned.toFixed(0)}
            </div>
            <div className="text-[11px] text-muted-foreground">из {totalMax} баллов</div>
          </div>
          <div className="surface-card rounded-xl p-4 text-center">
            <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1.5" />
            <div className="text-2xl font-bold font-mono">{rawPct.toFixed(0)}%</div>
            <div className="text-[11px] text-muted-foreground">сырая точность</div>
          </div>
          <div className="surface-card rounded-xl p-4 text-center">
            <Lightbulb className="h-4 w-4 text-amber-500 mx-auto mb-1.5" />
            <div className="text-2xl font-bold font-mono">{totalHints}</div>
            <div className="text-[11px] text-muted-foreground">подсказок</div>
          </div>
          <div className="surface-card rounded-xl p-4 text-center">
            <Clock className="h-4 w-4 text-emerald-500 mx-auto mb-1.5" />
            <div className="text-2xl font-bold font-mono">
              {totalDuration > 0 ? formatMinutes(totalDuration) : "—"}
            </div>
            <div className="text-[11px] text-muted-foreground">общее время</div>
          </div>
        </div>

        {totalHints > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <div className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Штраф за подсказки
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-background border border-amber-500/20 p-3">
                <div className="text-muted-foreground">Открыто подсказок</div>
                <div className="text-xl font-bold font-mono mt-1">{totalHints}</div>
              </div>
              <div className="rounded-lg bg-background border border-amber-500/20 p-3">
                <div className="text-muted-foreground">Штраф к итогу</div>
                <div className="text-xl font-bold font-mono mt-1 text-amber-600 dark:text-amber-400">
                  −{(penaltyFactor * 100).toFixed(1)}%
                </div>
                {penaltyFactor >= 0.25 && (
                  <div className="text-[10px] text-amber-700/80 dark:text-amber-300/70 mt-1">
                    достигнут лимит штрафа (25%)
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-background border border-amber-500/20 p-3">
                <div className="text-muted-foreground">Скорректированный счёт</div>
                <div className="text-xl font-bold font-mono mt-1">
                  {adjustedPct.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
              Каждая подсказка снимает 0.5% с итогового процента, но общий штраф
              ограничен 25%. Подсказки помогают учиться — главное не злоупотреблять.
            </div>
          </div>
        )}

        <div className="rounded-xl border bg-card p-6 mb-8">
          <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
            <div className="font-semibold">Детали по раундам</div>
            <div className="text-xs text-muted-foreground font-mono">
              {totalEarned.toFixed(0)} / {totalMax} ({rawPct.toFixed(1)}%)
            </div>
          </div>
          <div className="space-y-3">
            {rounds.map((r, i) => {
              const result = perRound[i];
              const isSkipped = !!result?.skipped;
              const rPct = result && result.max > 0 ? (result.earned / result.max) * 100 : 0;
              const isBest = i === bestIdx && result && result.max > 0 && !isSkipped;
              const isWorst =
                i === worstIdx &&
                result &&
                result.max > 0 &&
                !isSkipped &&
                bestIdx !== worstIdx;
              return (
                <div key={r.number} className="space-y-1.5">
                  <div className="flex items-baseline justify-between text-sm gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-primary">{r.number}.</span>
                      <span className="truncate">{r.title}</span>
                      {isSkipped && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          пройдено (админ)
                        </span>
                      )}
                      {isBest && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                          лучший
                        </span>
                      )}
                      {isWorst && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30 font-semibold">
                          подтянуть
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground whitespace-nowrap flex items-center gap-2">
                      {result?.hintsRevealed ? (
                        <span className="flex items-center gap-1 text-amber-500/80">
                          <Lightbulb className="h-3 w-3" />
                          {result.hintsRevealed}
                        </span>
                      ) : null}
                      {isSkipped
                        ? "не учитывается"
                        : `${result?.earned ?? 0} / ${result?.max ?? 0}`}
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    {isSkipped ? (
                      <div
                        className="h-full bg-emerald-500/40"
                        style={{
                          width: "100%",
                          backgroundImage:
                            "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 8px)",
                        }}
                      />
                    ) : (
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${rPct}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          {!hideContinue && (
            <Button size="lg" onClick={onContinue} className="flex-1 h-12 text-base" data-testid="button-to-assignment">
              {continueLabel ?? "К финальному заданию"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <FinalReportDownloadButton
            courseLabel={courseLabel ?? "Курс"}
            grade={grade}
            rounds={rounds}
            perRound={perRound.map((r) => r?.perExercise ?? [])}
          />
          <Button
            size="lg"
            variant="outline"
            onClick={onRestart}
            className={hideContinue ? "flex-1 h-12 text-base" : "h-12"}
            data-testid="button-restart"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {hideContinue ? "На главную" : "Пройти снова"}
          </Button>
        </div>
      </div>
    </div>
  );
}
