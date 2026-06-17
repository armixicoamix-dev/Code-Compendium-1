import { useMemo, useState, useEffect } from "react";
import { Round, Exercise, TOTAL_ROUNDS } from "@/data/curriculum";
import { ExerciseFill } from "@/components/ExerciseFill";
import { ExerciseQuestion } from "@/components/ExerciseQuestion";
import { ExerciseWrite } from "@/components/ExerciseWrite";
import { ExerciseWriteWeb } from "@/components/ExerciseWriteWeb";
import { ExerciseWriteFlask } from "@/components/ExerciseWriteFlask";
import { ExerciseFillLines } from "@/components/ExerciseFillLines";
import { RunningGradeBadge } from "@/components/RunningGradeBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronLeft, Home } from "lucide-react";
import { RunningGradeInfo } from "@/lib/runningGrade";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface PerExerciseResult {
  id: string;
  earned: number;
  max: number;
  type: Exercise["type"];
  hintsRevealed: number;
  userInput?: string | string[];
}

export interface RoundResult {
  earned: number;
  max: number;
  hintsRevealed: number;
  perExercise: PerExerciseResult[];
  durationMs?: number;
  skipped?: boolean;
}

type SavedInputs = Record<string, string | string[]>;

export function RoundView({
  round,
  onFinish,
  onHome,
  runningGrade,
  totalRounds = TOTAL_ROUNDS,
}: {
  round: Round;
  onFinish: (result: RoundResult) => void;
  onHome?: () => void;
  runningGrade?: RunningGradeInfo | null;
  totalRounds?: number;
}) {
  const sequence = useMemo<Exercise[]>(() => {
    const seq: Exercise[] = [];
    const fillLines = round.fillLines ?? [];
    const max = Math.max(
      round.fills.length,
      round.questions.length,
      round.writes.length,
      fillLines.length,
    );
    for (let i = 0; i < max; i++) {
      if (round.fills[i]) seq.push(round.fills[i]);
      if (round.questions[i]) seq.push(round.questions[i]);
      if (round.writes[i]) seq.push(round.writes[i]);
      if (fillLines[i]) seq.push(fillLines[i]);
    }
    return seq;
  }, [round]);

  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<PerExerciseResult[]>([]);
  const [startedAt] = useState<number>(() => Date.now());
  const [savedInputs, setSavedInputs] = useState<SavedInputs>({});
  const [mountKeys, setMountKeys] = useState<number[]>([]);

  useEffect(() => {
    setIdx(0);
    setResults([]);
    setSavedInputs({});
    setMountKeys([]);
  }, [round.number]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const current = sequence[idx];

  const saveInput = (id: string, val: string | string[]) => {
    setSavedInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleComplete = (
    earned: number,
    max: number,
    meta: { hintsRevealed: number; input?: string | string[] },
  ) => {
    const next: PerExerciseResult[] = [
      ...results,
      {
        id: current.id,
        earned,
        max,
        type: current.type,
        hintsRevealed: meta.hintsRevealed,
        userInput: meta.input ?? savedInputs[current.id],
      },
    ];
    setResults(next);

    if (idx + 1 >= sequence.length) {
      const totals = next.reduce(
        (acc, r) => ({
          earned: acc.earned + r.earned,
          max: acc.max + r.max,
          hints: acc.hints + r.hintsRevealed,
        }),
        { earned: 0, max: 0, hints: 0 },
      );
      onFinish({
        earned: totals.earned,
        max: totals.max,
        hintsRevealed: totals.hints,
        perExercise: next,
        durationMs: Date.now() - startedAt,
      });
    } else {
      setIdx(idx + 1);
    }
  };

  const handleBack = () => {
    if (idx === 0) return;
    const prevIdx = idx - 1;
    setResults((prev) => prev.slice(0, prevIdx));
    setMountKeys((prev) => {
      const copy = [...prev];
      copy[prevIdx] = (copy[prevIdx] ?? 0) + 1;
      return copy;
    });
    setIdx(prevIdx);
  };

  const exerciseKey = `${current.id}#${mountKeys[idx] ?? 0}`;

  const progress = ((idx + (results.length > idx ? 1 : 0)) / sequence.length) * 100;
  const totalHints = results.reduce((a, r) => a + r.hintsRevealed, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/60">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between mb-2 text-xs gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              {onHome && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 -ml-1"
                      title="Вернуться на главную (прогресс этого раунда не сохранится)"
                      data-testid="button-home-during-round"
                    >
                      <Home className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">Главная</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Выйти на главную?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Прогресс <strong>этого раунда</strong> не сохранится — то, что ты уже ответил
                        в текущем раунде, обнулится. Результаты предыдущих раундов
                        и общий прогресс остаются нетронутыми.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Остаться</AlertDialogCancel>
                      <AlertDialogAction onClick={onHome} data-testid="button-home-confirm">
                        Да, на главную
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={handleBack}
                disabled={idx === 0}
                title={
                  idx === 0
                    ? "Это первое задание раунда"
                    : "Вернуться к предыдущему заданию (твой ответ сохранён)"
                }
                data-testid="button-back-exercise"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
              <span className="font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                Раунд {round.number}/{totalRounds}
              </span>
              <span className="text-muted-foreground hidden sm:inline truncate">
                {round.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {runningGrade && (
                <RunningGradeBadge
                  info={runningGrade}
                  totalRounds={totalRounds}
                  variant="chip"
                />
              )}
              {totalHints > 0 && (
                <span
                  className="flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400"
                  title="Открытых подсказок в этом раунде"
                >
                  <Lightbulb className="h-3 w-3" />
                  {totalHints}
                </span>
              )}
              <div className="font-mono text-muted-foreground">
                Задание {idx + 1} / {sequence.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-8 pb-24">
        {current.type === "fill" && (
          <ExerciseFill
            key={exerciseKey}
            exercise={current}
            onComplete={handleComplete}
            initialValues={savedInputs[current.id] as string[] | undefined}
            onInputChange={(v) => saveInput(current.id, v)}
          />
        )}
        {current.type === "question" && (
          <ExerciseQuestion
            key={exerciseKey}
            exercise={current}
            onComplete={handleComplete}
            initialAnswer={savedInputs[current.id] as string | undefined}
            onInputChange={(v) => saveInput(current.id, v)}
          />
        )}
        {current.type === "write" && current.language === "web" && (
          <ExerciseWriteWeb
            key={exerciseKey}
            exercise={current}
            onComplete={handleComplete}
            initialCode={savedInputs[current.id] as string | undefined}
            onInputChange={(v) => saveInput(current.id, v)}
          />
        )}
        {current.type === "write" && current.language === "flask-web" && (
          <ExerciseWriteFlask
            key={exerciseKey}
            exercise={current}
            onComplete={handleComplete}
            initialCode={savedInputs[current.id] as string | undefined}
            onInputChange={(v) => saveInput(current.id, v)}
          />
        )}
        {current.type === "write" && (!current.language || current.language === "python") && (
          <ExerciseWrite
            key={exerciseKey}
            exercise={current}
            onComplete={handleComplete}
            initialCode={savedInputs[current.id] as string | undefined}
            onInputChange={(v) => saveInput(current.id, v)}
          />
        )}
        {current.type === "fill-lines" && (
          <ExerciseFillLines
            key={exerciseKey}
            exercise={current}
            onComplete={handleComplete}
            initialValues={savedInputs[current.id] as string[] | undefined}
            onInputChange={(v) => saveInput(current.id, v)}
          />
        )}
      </div>
    </div>
  );
}
