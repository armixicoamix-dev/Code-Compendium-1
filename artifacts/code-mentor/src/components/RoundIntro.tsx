import { Round, TOTAL_ROUNDS } from "@/data/curriculum";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, FileQuestion, PenTool, Sparkles, Layers, Home, BookOpen, Zap } from "lucide-react";
import { LessonView } from "./LessonView";
import { RunningGradeBadge } from "./RunningGradeBadge";
import { RunningGradeInfo } from "@/lib/runningGrade";
import { renderRichText } from "@/lib/richText";

export function RoundIntro({
  round,
  onStart,
  onHome,
  runningGrade,
  totalRounds = TOTAL_ROUNDS,
}: {
  round: Round;
  onStart: () => void;
  onHome?: () => void;
  runningGrade?: RunningGradeInfo | null;
  totalRounds?: number;
}) {
  const totalBlanks = (round.fills ?? []).reduce((s, f) => s + f.answers.length, 0);
  const fillLines = round.fillLines ?? [];
  const totalLineBlanks = fillLines.reduce((s, f) => s + f.blanks.length, 0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Glow orb */}
      <div
        className="glow-orb"
        style={{
          width: 500,
          height: 500,
          left: "50%",
          top: "-200px",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, hsl(217 91% 65% / 0.38), transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back home */}
        {onHome && (
          <div className="mb-6 -mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onHome}
              className="gap-2 -ml-2 text-muted-foreground hover:text-foreground touch-target"
              data-testid="button-home-intro"
            >
              <Home className="h-3.5 w-3.5" />
              На главную
            </Button>
          </div>
        )}

        {/* Round badge */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            Раунд {round.number} из {totalRounds}
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/12 text-accent border border-accent/25 text-xs font-bold uppercase tracking-wider">
            {round.level}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 text-gradient leading-[1.06]">
          {round.title}
        </h1>

        <div className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-8 space-y-2">
          {renderRichText(round.intro)}
        </div>

        {/* Running grade */}
        {runningGrade && (
          <div className="mb-8">
            <RunningGradeBadge info={runningGrade} totalRounds={totalRounds} />
          </div>
        )}

        {/* Lesson / methodology */}
        {round.lesson && (
          <div className="mb-10">
            <LessonView lesson={round.lesson} defaultOpen />
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { num: (round.fills ?? []).length, label: "fill-задач", color: "primary" },
            { num: totalBlanks, label: "пропусков", color: "accent" },
            {
              num: round.questions.length + round.writes.length,
              label: round.writes.length > 0 ? "вопросов и задач" : "вопросов",
              color: "primary",
            },
            ...(fillLines.length > 0
              ? [{ num: fillLines.length, label: "блочных задач", color: "accent" }]
              : []),
          ].map((s, i) => (
            <div
              key={i}
              className="surface-card rounded-xl p-4 text-center"
            >
              <div
                className="text-3xl sm:text-4xl font-extrabold font-mono mb-1"
                style={{ color: s.color === "primary" ? "hsl(217 91% 72%)" : "hsl(280 90% 75%)" }}
              >
                {s.num}
              </div>
              <div className="text-xs text-muted-foreground leading-snug">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Exercise type breakdown */}
        <div className="space-y-3 mb-10">
          {[
            {
              icon: Code2,
              title: `${(round.fills ?? []).length} задания на заполнение пропусков`,
              text: `Реальные классы с ${totalBlanks} пропущенными ключевыми словами и операторами. Заполняешь — проверяешь мгновенно.`,
              color: "primary" as const,
            },
            {
              icon: FileQuestion,
              title: `${round.questions.length} тестовых вопроса`,
              text: "Открытые вопросы без вариантов ответов — пишешь сам, проверяешь понимание.",
              color: "accent" as const,
            },
            ...(round.writes.length > 0
              ? [
                  {
                    icon: PenTool,
                    title: `${round.writes.length} задачи на написание с нуля`,
                    text: "Полноценные классы по описанию. Запускай код прямо в браузере, подсказки есть.",
                    color: "primary" as const,
                  },
                ]
              : []),
            ...(fillLines.length > 0
              ? [
                  {
                    icon: Layers,
                    title: `${fillLines.length} задач на блоки кода`,
                    text: `${totalLineBlanks} пропущенных строк и блоков — нужно писать целые куски Python, не только слова.`,
                    color: "accent" as const,
                  },
                ]
              : []),
          ].map((c, i) => (
            <div
              key={i}
              className="surface-card rounded-xl p-4 flex items-start gap-4"
            >
              <div
                className={`h-10 w-10 rounded-xl grid place-items-center flex-shrink-0 ${
                  c.color === "primary"
                    ? "bg-primary/15 text-primary"
                    : "bg-accent/15 text-accent"
                }`}
              >
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-sm sm:text-base">{c.title}</div>
                <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{c.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            size="lg"
            onClick={onStart}
            className="h-12 px-8 text-base font-semibold flex-1 sm:flex-none touch-target"
            data-testid="button-start-round"
            style={{
              boxShadow: "0 8px 24px -8px hsl(217 91% 65% / 0.6), 0 0 0 1px hsl(217 91% 65% / 0.4)",
            }}
          >
            <Zap className="mr-2 h-4 w-4" />
            Начать раунд
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {onHome && (
            <Button
              size="lg"
              variant="outline"
              onClick={onHome}
              className="h-12 px-6 text-base touch-target"
              data-testid="button-home-intro-bottom"
            >
              <Home className="mr-2 h-4 w-4" />
              На главную
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
