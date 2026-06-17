import { AlertTriangle, BookOpen, Lightbulb, Sparkles } from "lucide-react";
import type { ExerciseExplanation } from "@/data/curriculum";
import { renderInline } from "@/lib/richText";

interface ExplanationBoxProps {
  explanation: ExerciseExplanation;
}

export function ExplanationBox({ explanation }: ExplanationBoxProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-primary/30"
      style={{
        background:
          "linear-gradient(180deg, hsl(217 91% 65% / 0.08), hsl(217 91% 65% / 0.02))",
        boxShadow:
          "0 1px 0 hsl(0 0% 100% / 0.04) inset, 0 16px 40px -16px hsl(217 91% 65% / 0.35)",
      }}
    >
      <div className="px-5 py-3 border-b border-primary/20 bg-primary/10 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Подробное объяснение
        </span>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary grid place-items-center flex-shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              О чём это упражнение
            </div>
            <div className="text-sm text-foreground/90 leading-relaxed space-y-1.5">
              {explanation.summary.split("\n").map((line, i) => (
                <p key={i}>{renderInline(line)}</p>
              ))}
            </div>
          </div>
        </div>

        {explanation.keyPoints.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400 grid place-items-center flex-shrink-0">
              <Lightbulb className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                Ключевые моменты — что и зачем
              </div>
              <ul className="space-y-2">
                {explanation.keyPoints.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-foreground/90 leading-relaxed"
                  >
                    <span className="flex-shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{renderInline(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {explanation.pitfalls && explanation.pitfalls.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-400 grid place-items-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                На чём здесь спотыкаются
              </div>
              <ul className="space-y-2">
                {explanation.pitfalls.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed"
                  >
                    <span className="flex-shrink-0 mt-2 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{renderInline(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {explanation.realWorld && (
          <div className="rounded-lg border-l-2 border-accent bg-accent/5 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
              В реальном коде
            </div>
            <p className="text-sm text-foreground/85 leading-relaxed">
              {renderInline(explanation.realWorld)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
