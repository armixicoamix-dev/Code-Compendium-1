import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronRight } from "lucide-react";

export interface HintBoxProps {
  hints: string[];
  label?: string;
  onHintReveal?: (totalRevealed: number) => void;
}

export function HintBox({
  hints,
  label = "Подсказки",
  onHintReveal,
}: HintBoxProps) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    hints.map(() => false),
  );

  const revealedCount = revealed.filter(Boolean).length;

  const reveal = (idx: number) => {
    setRevealed((arr) => {
      if (arr[idx]) return arr;
      const next = [...arr];
      next[idx] = true;
      const total = next.filter(Boolean).length;
      onHintReveal?.(total);
      return next;
    });
  };

  if (hints.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-300 hover-elevate"
      >
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <Lightbulb className="h-4 w-4" />
        <span>
          {label} ({hints.length})
        </span>
        {revealedCount > 0 && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
            раскрыто {revealedCount}/{hints.length}
          </span>
        )}
        <span className="ml-auto text-xs text-amber-600/70 dark:text-amber-400/70 hidden sm:inline">
          подсказки немного снижают итоговую оценку
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3 space-y-2">
          {hints.map((h, idx) => (
            <div
              key={idx}
              className="rounded-md border border-amber-500/20 bg-background"
            >
              {revealed[idx] ? (
                <div className="px-3 py-2 text-sm text-foreground">
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400 mr-2">
                    #{idx + 1}
                  </span>
                  {h}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => reveal(idx)}
                  className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover-elevate"
                  data-testid={`hint-reveal-${idx}`}
                >
                  <span className="font-mono text-xs text-amber-600 dark:text-amber-400 mr-2">
                    #{idx + 1}
                  </span>
                  Открыть подсказку
                </button>
              )}
            </div>
          ))}
          <div className="text-[11px] text-amber-700/80 dark:text-amber-300/70 italic pt-1">
            За каждую открытую подсказку — небольшой штраф к итоговой оценке (общий лимит 25%).
          </div>
        </div>
      )}
    </div>
  );
}
