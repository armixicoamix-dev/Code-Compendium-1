import { useState } from "react";
import type { ReactNode } from "react";
import { Round } from "@/data/curriculum";
import { PerExerciseResult } from "@/components/RoundView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  buildRoundReport,
  generateRoundHtml,
  generateFinalHtml,
  downloadHtml,
  ReportExercise,
  FinalReportRound,
} from "@/lib/reportDownload";
import {
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  Code2,
  FileQuestion,
  PenTool,
  Layers,
} from "lucide-react";

function typeIcon(type: ReportExercise["type"]) {
  switch (type) {
    case "fill": return <Code2 className="h-3.5 w-3.5 text-primary" />;
    case "question": return <FileQuestion className="h-3.5 w-3.5 text-accent" />;
    case "write": return <PenTool className="h-3.5 w-3.5 text-emerald-400" />;
    case "fill-lines": return <Layers className="h-3.5 w-3.5 text-fuchsia-400" />;
    default: return <FileText className="h-3.5 w-3.5" />;
  }
}

function typeLabel(type: ReportExercise["type"]) {
  switch (type) {
    case "fill": return "Заполни пропуски";
    case "question": return "Вопрос с ответом";
    case "write": return "Напиши с нуля";
    case "fill-lines": return "Блоки кода";
    default: return type;
  }
}

function UserInput({ input, type }: { input?: string | string[]; type: ReportExercise["type"] }) {
  if (input === undefined || input === null) {
    return <span className="text-xs text-muted-foreground italic">—</span>;
  }

  if (type === "write") {
    const code = typeof input === "string" ? input : (input as string[]).join("\n");
    return (
      <pre className="mt-1 rounded-lg bg-background border border-border/50 px-3 py-2.5 text-xs font-mono text-foreground/85 whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto">
        {code || "—"}
      </pre>
    );
  }

  if (Array.isArray(input)) {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {input.map((v, i) => (
          <code
            key={i}
            className="px-2 py-0.5 rounded bg-muted/50 border border-border/50 text-xs font-mono text-foreground/80"
          >
            #{i + 1}: {v || "—"}
          </code>
        ))}
      </div>
    );
  }

  return (
    <code className="px-2 py-0.5 rounded bg-muted/50 border border-border/50 text-xs font-mono text-foreground/80">
      {input || "—"}
    </code>
  );
}

function ExerciseRow({ ex }: { ex: ReportExercise }) {
  const isFullScore = ex.earned === ex.max;
  const isPartial = !isFullScore && ex.earned > 0;
  const scoreColor = isFullScore
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
    : isPartial
    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : "text-rose-400 bg-rose-500/10 border-rose-500/30";

  const correctAnswers = (ex.correctAnswers ?? []).slice(0, 6);

  return (
    <div className="rounded-xl border bg-card/60 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {typeIcon(ex.type)}
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
            {typeLabel(ex.type)}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold font-mono px-2.5 py-1 rounded-md border flex-shrink-0 ${scoreColor}`}>
          {isFullScore ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
          {ex.earned} / {ex.max}
        </div>
      </div>

      <div className="font-semibold text-sm text-foreground leading-snug">{ex.title}</div>

      {ex.question && (
        <div className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{ex.question}</div>
      )}

      <div className="space-y-2 pt-1 border-t border-border/30">
        <div>
          <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            Твой ответ
          </div>
          <UserInput input={ex.userInput} type={ex.type} />
        </div>

        {correctAnswers.length > 0 && (
          <div>
            <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              {ex.type === "write" ? "Ключевые конструкции" : "Правильный ответ"}
            </div>
            <div className="flex flex-wrap gap-1">
              {correctAnswers.map((a, i) => (
                <code
                  key={i}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono"
                >
                  {a}
                </code>
              ))}
              {(ex.correctAnswers?.length ?? 0) > 6 && (
                <span className="text-xs text-muted-foreground self-center">
                  +{(ex.correctAnswers?.length ?? 0) - 6} ещё
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {ex.hintsRevealed > 0 && (
        <div className="text-[10px] text-amber-500/80 flex items-center gap-1">
          💡 Подсказок использовано: {ex.hintsRevealed}
        </div>
      )}
    </div>
  );
}

export function RoundReportModal({
  round,
  perExercise,
  earned,
  max,
  durationMs,
  trigger,
}: {
  round: Round;
  perExercise: PerExerciseResult[];
  earned: number;
  max: number;
  durationMs?: number;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const exercises = buildRoundReport(round, perExercise);
  const pct = max > 0 ? Math.round((earned / max) * 100) : 0;

  const handleDownload = () => {
    const html = generateRoundHtml(round.title, round.number, exercises, earned, max, durationMs);
    downloadHtml(html, `раунд-${round.number}-результаты.html`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            Детали раунда
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-2 border-b border-border/40">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Раунд {round.number}</div>
              <DialogTitle className="text-lg leading-tight">{round.title}</DialogTitle>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold font-mono text-primary">
                {earned}
                <span className="text-muted-foreground text-base font-normal"> / {max}</span>
              </div>
              <div className="text-xs text-muted-foreground">{pct}%</div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {exercises.map((ex) => (
            <ExerciseRow key={ex.id} ex={ex} />
          ))}
        </div>

        <div className="flex-shrink-0 pt-3 border-t border-border/40">
          <Button onClick={handleDownload} className="w-full gap-2" variant="outline">
            <Download className="h-4 w-4" />
            Скачать результаты в HTML
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FinalReportDownloadButton({
  courseLabel,
  grade,
  rounds,
  perRound,
}: {
  courseLabel: string;
  grade: number;
  rounds: Round[];
  perRound: PerExerciseResult[][];
}) {
  const handleDownload = () => {
    const roundsData: FinalReportRound[] = rounds.map((round, i) => {
      const exercises = perRound[i] ?? [];
      return {
        round,
        result: exercises,
        earned: exercises.reduce((a, r) => a + r.earned, 0),
        max: exercises.reduce((a, r) => a + r.max, 0),
      };
    });
    const html = generateFinalHtml(courseLabel, grade, roundsData);
    downloadHtml(html, `итоговые-результаты-${courseLabel.replace(/\s+/g, "-").toLowerCase()}.html`);
  };

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2 h-12">
      <Download className="h-4 w-4" />
      Скачать итоговый отчёт (HTML)
    </Button>
  );
}
