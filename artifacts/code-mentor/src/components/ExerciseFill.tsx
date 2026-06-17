import { useState, useMemo } from "react";
import { CodeFillExercise } from "@/data/curriculum";
import { CodeBlanks, gradeBlanks } from "@/components/CodeBlanks";
import { HintBox } from "@/components/HintBox";
import { ExplanationBox } from "@/components/ExplanationBox";
import { PythonRunner } from "@/components/PythonRunner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Code2, RefreshCw, Play } from "lucide-react";
import { renderInline } from "@/lib/richText";

/** Replace {{N}} blanks in template with user-filled values */
function buildCompleted(template: string, values: string[]): string {
  return template.replace(/\{\{(\d+)\}\}/g, (_, n) => {
    const v = values[parseInt(n, 10)];
    return v != null && v.trim() !== "" ? v.trim() : "___";
  });
}

export function ExerciseFill({
  exercise,
  onComplete,
  initialValues,
  onInputChange,
}: {
  exercise: CodeFillExercise;
  onComplete: (score: number, max: number, meta: { hintsRevealed: number; input?: string | string[] }) => void;
  initialValues?: string[];
  onInputChange?: (values: string[]) => void;
}) {
  const [values, setValues] = useState<string[]>(
    () => initialValues ?? exercise.answers.map(() => ""),
  );
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  const handleChange = (v: string[]) => {
    setValues(v);
    if (checked) {
      setChecked(false);
      setResult(null);
    }
    onInputChange?.(v);
  };

  const onCheck = () => {
    const r = gradeBlanks(values, exercise.answers);
    setResult(r);
    setChecked(true);
  };

  const onReset = () => {
    setValues(exercise.answers.map(() => ""));
    setChecked(false);
    setResult(null);
  };

  const onNext = () => {
    if (!result) return;
    onComplete(result.correct, result.total, { hintsRevealed, input: values });
  };

  const allCorrect = result?.correct === result?.total;
  const isWeb = exercise.language === "web" || exercise.id.startsWith("h");

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/15 text-primary grid place-items-center flex-shrink-0">
          <Code2 className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
            Заполни пропуски в коде
          </div>
          <h3 className="text-xl font-semibold leading-tight">{exercise.title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {renderInline(exercise.description)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
        <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
        Регистр и пробелы в начале/конце не важны. Принимается несколько правильных вариантов.
      </div>

      <CodeBlanks
        code={exercise.code}
        answers={exercise.answers}
        checked={checked}
        values={values}
        onChange={handleChange}
        filename={isWeb ? "index.html" : "exercise.py"}
        lang={isWeb ? "HTML/CSS/JS" : "Python"}
      />

      <HintBox
        hints={exercise.hints}
        label="Подсказки по пропускам"
        onHintReveal={(n) => setHintsRevealed(n)}
      />

      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={onCheck} data-testid="button-check-fill">
          Проверить
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Сброс
        </Button>

        {checked && result && (
          <>
            <div
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border ${
                allCorrect
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {allCorrect ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {result.correct} из {result.total} верно
            </div>
            <Button onClick={onNext} data-testid="button-next-fill">
              Дальше
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {checked && !allCorrect && (
        <div className="text-xs text-muted-foreground italic">
          Поправь неверные пропуски (выделены красным) и нажми «Проверить» снова.
        </div>
      )}

      {/* Run the completed code — only for Python exercises */}
      {checked && !isWeb && (
        <RunCompleted code={buildCompleted(exercise.code, values)} />
      )}

      {checked && exercise.explanation && (
        <ExplanationBox explanation={exercise.explanation} />
      )}
    </div>
  );
}

/** Renders a collapsible PythonRunner with the completed (blanks filled) code */
function RunCompleted({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const hasReal = !code.includes("___");
  return (
    <div className="rounded-xl border bg-card/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors text-left"
      >
        <Play className="h-3.5 w-3.5 text-primary" />
        {open ? "Скрыть запуск кода" : "Запустить заполненный код в Python"}
        {!hasReal && (
          <span className="ml-auto text-amber-400">заполни все пропуски для корректного запуска</span>
        )}
      </button>
      {open && (
        <div className="border-t">
          <PythonRunner code={code} />
        </div>
      )}
    </div>
  );
}
