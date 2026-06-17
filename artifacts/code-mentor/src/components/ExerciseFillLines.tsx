import { useMemo, useState } from "react";
import { renderInline } from "@/lib/richText";
import {
  CodeFillLinesExercise,
  LineBlank,
} from "@/data/curriculum";
import { HintBox } from "@/components/HintBox";
import { ExplanationBox } from "@/components/ExplanationBox";
import { PythonRunner } from "@/components/PythonRunner";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  AlertTriangle,
  Eye,
  EyeOff,
  Play,
} from "lucide-react";
import { highlightPython } from "@/lib/highlight";

/** Build runnable code by substituting LINE blanks with user values (or references) */
function buildCompletedLines(
  template: string,
  values: string[],
  blanks: LineBlank[],
  useReference: boolean,
): string {
  return template.replace(/^([ \t]*)\{\{LINE:(\d+)\}\}[ \t]*$/gm, (_, indent, n) => {
    const idx = parseInt(n, 10);
    const raw = useReference ? (blanks[idx]?.reference ?? "") : (values[idx] ?? "");
    return raw
      .split("\n")
      .map((l) => (l.startsWith(indent) ? l : indent + l.trimStart()))
      .join("\n");
  });
}

interface BlankResult {
  hits: number;
  total: number;
  forbiddenHits: string[];
  ratio: number;
}

interface FillLinesResult {
  perBlank: BlankResult[];
  earned: number;
  max: number;
}

function gradeBlank(text: string, blank: LineBlank): BlankResult {
  const t = text;
  const hits = blank.required.filter((kw) => t.includes(kw)).length;
  const total = blank.required.length;
  const forbiddenHits = (blank.forbidden ?? []).filter((kw) => t.includes(kw));
  let earned = hits - forbiddenHits.length;
  if (earned < 0) earned = 0;
  return { hits, total, forbiddenHits, ratio: total === 0 ? 0 : earned / total };
}

function gradeAll(values: string[], ex: CodeFillLinesExercise): FillLinesResult {
  let earned = 0;
  let max = 0;
  const perBlank: BlankResult[] = ex.blanks.map((b, i) => {
    const r = gradeBlank(values[i] ?? "", b);
    max += b.required.length;
    earned += Math.min(b.required.length, Math.max(0, r.hits - r.forbiddenHits.length));
    return r;
  });
  return { perBlank, earned, max };
}

interface Segment {
  kind: "code" | "blank";
  text?: string;
  indent?: string;
  index?: number;
}

function splitCode(code: string): Segment[] {
  const re = /^([ \t]*)\{\{LINE:(\d+)\}\}[ \t]*$/gm;
  const segments: Segment[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    if (m.index > last) {
      let text = code.slice(last, m.index);
      if (text.endsWith("\n")) text = text.slice(0, -1);
      if (text.length > 0) segments.push({ kind: "code", text });
    }
    segments.push({
      kind: "blank",
      indent: m[1],
      index: parseInt(m[2], 10),
    });
    last = re.lastIndex;
    if (code[last] === "\n") last += 1;
  }
  if (last < code.length) {
    segments.push({ kind: "code", text: code.slice(last) });
  }
  return segments;
}

export function ExerciseFillLines({
  exercise,
  onComplete,
  initialValues,
  onInputChange,
}: {
  exercise: CodeFillLinesExercise;
  onComplete: (
    score: number,
    max: number,
    meta: { hintsRevealed: number; input?: string | string[] },
  ) => void;
  initialValues?: string[];
  onInputChange?: (values: string[]) => void;
}) {
  const segments = useMemo(() => splitCode(exercise.code), [exercise.code]);
  const [values, setValues] = useState<string[]>(
    () => initialValues ?? exercise.blanks.map(() => ""),
  );
  const [checked, setChecked] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showRefs, setShowRefs] = useState<boolean[]>(() =>
    exercise.blanks.map(() => false),
  );

  const result = useMemo<FillLinesResult | null>(
    () => (checked ? gradeAll(values, exercise) : null),
    [checked, values, exercise],
  );

  const hintList = useMemo(
    () => exercise.blanks.map((b, i) => `Блок #${i + 1}: ${b.hint}`),
    [exercise.blanks],
  );

  const handleChange = (next: string[]) => {
    setValues(next);
    if (checked) setChecked(false);
    onInputChange?.(next);
  };

  const onCheck = () => setChecked(true);
  const onNext = () => {
    if (!result) return;
    onComplete(result.earned, result.max, { hintsRevealed, input: values });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-fuchsia-500/15 text-fuchsia-400 grid place-items-center flex-shrink-0">
          <Code2 className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-fuchsia-400 mb-1">
            Заполнение строк и блоков
          </div>
          <h3 className="text-xl font-semibold leading-tight">{exercise.title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {renderInline(exercise.description)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-3 text-xs flex items-start gap-2 text-muted-foreground">
        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-fuchsia-400" />
        <div className="leading-relaxed">
          В коде пропущены целые строки или блоки. Впиши недостающий Python в каждое поле.
          Баллы начисляются за каждое найденное ключевое слово/конструкцию. Если не получается —
          нажми «Показать эталон» после проверки.
        </div>
      </div>

      <div className="code-editor">
        <div className="code-editor__chrome">
          <span className="dot r" />
          <span className="dot y" />
          <span className="dot g" />
          <span className="code-editor__filename">{exercise.id}.py</span>
          <span className="code-editor__lang">Python</span>
        </div>
        <div className="fill-lines__body">
          {segments.map((seg, i) => {
            if (seg.kind === "code" && seg.text !== undefined) {
              return (
                <pre
                  key={`c-${i}`}
                  className="fill-lines__code"
                  dangerouslySetInnerHTML={{ __html: highlightPython(seg.text) }}
                />
              );
            }
            const idx = seg.index!;
            const blank = exercise.blanks[idx];
            const r = result?.perBlank[idx] ?? null;
            const tone =
              r === null
                ? "neutral"
                : r.ratio >= 0.999
                  ? "correct"
                  : r.ratio >= 0.5
                    ? "partial"
                    : "incorrect";
            return (
              <div
                key={`b-${i}`}
                className={`fill-lines__blank fill-lines__blank--${tone}`}
              >
                <div className="fill-lines__blank-header">
                  <span className="fill-lines__blank-tag">
                    блок #{idx + 1}
                    {seg.indent && seg.indent.length > 0 && (
                      <span className="opacity-60 ml-2">
                        отступ: {seg.indent.length} проб.
                      </span>
                    )}
                  </span>
                  {r && (
                    <span
                      className={`fill-lines__blank-score fill-lines__blank-score--${tone}`}
                    >
                      {Math.min(blank.required.length, Math.max(0, r.hits - r.forbiddenHits.length))} / {blank.required.length}
                    </span>
                  )}
                </div>
                <textarea
                  value={values[idx] ?? ""}
                  onChange={(e) => {
                    const next = [...values];
                    next[idx] = e.target.value;
                    handleChange(next);
                  }}
                  onKeyDown={(e) => {
                    const el = e.currentTarget;
                    const val = values[idx] ?? "";
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const start = el.selectionStart;
                      const end = el.selectionEnd;
                      const next = [...values];
                      next[idx] = val.slice(0, start) + "    " + val.slice(end);
                      handleChange(next);
                      requestAnimationFrame(() => {
                        el.selectionStart = el.selectionEnd = start + 4;
                      });
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      const start = el.selectionStart;
                      const lineStart = val.lastIndexOf("\n", start - 1) + 1;
                      const currentLine = val.slice(lineStart, start);
                      const indent = currentLine.match(/^(\s*)/)?.[1] ?? "";
                      const lineContent = currentLine.replace(/#.*$/, "").trimEnd();
                      const extra = lineContent.endsWith(":") ? "    " : "";
                      const insert = "\n" + indent + extra;
                      const next = [...values];
                      next[idx] = val.slice(0, start) + insert + val.slice(el.selectionEnd);
                      handleChange(next);
                      requestAnimationFrame(() => {
                        el.selectionStart = el.selectionEnd = start + insert.length;
                      });
                    }
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  rows={Math.max(blank.lines, 1)}
                  placeholder={
                    blank.placeholder ??
                    `# впиши ${blank.lines === 1 ? "строку" : `${blank.lines} строки`} Python`
                  }
                  className="fill-lines__textarea"
                  data-testid={`line-blank-${idx}`}
                />
                {r && r.forbiddenHits.length > 0 && (
                  <div className="fill-lines__forbidden">
                    Содержит запрещённое: {r.forbiddenHits.map((k) => (
                      <code key={k} className="px-1.5 py-0.5 mx-0.5 rounded bg-rose-500/15 text-rose-300 text-[11px]">
                        {k}
                      </code>
                    ))}
                  </div>
                )}
                {checked && (
                  <div className="fill-lines__refbar">
                    <button
                      type="button"
                      className="fill-lines__refbtn"
                      onClick={() => {
                        setShowRefs((arr) => {
                          const n = [...arr];
                          n[idx] = !n[idx];
                          return n;
                        });
                      }}
                    >
                      {showRefs[idx] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showRefs[idx] ? "Скрыть эталон" : "Показать эталон"}
                    </button>
                    {showRefs[idx] && (
                      <pre
                        className="fill-lines__reference"
                        dangerouslySetInnerHTML={{
                          __html: highlightPython(blank.reference),
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <HintBox
        hints={hintList}
        label="Подсказки по блокам"
        onHintReveal={(n) => setHintsRevealed(n)}
      />

      <div className="flex items-center gap-3 flex-wrap">
        {!checked || (result && result.earned < result.max) ? (
          <Button onClick={onCheck} data-testid="button-check-fill-lines">
            Проверить
          </Button>
        ) : null}

        {checked && result && (
          <>
            <div
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border ${
                result.earned === result.max
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                  : result.earned >= result.max / 2
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30"
              }`}
            >
              {result.earned === result.max ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {result.earned} / {result.max} баллов
            </div>
            <Button onClick={onNext} data-testid="button-next-fill-lines">
              Дальше
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {checked && result && result.earned < result.max && (
        <div className="text-xs text-muted-foreground italic">
          Можешь поправить блоки и нажать «Проверить» снова. Если застрял — «Показать эталон».
        </div>
      )}

      {/* Run completed code with error explanations */}
      {checked && (
        <RunCompletedLines
          template={exercise.code}
          values={values}
          blanks={exercise.blanks}
        />
      )}

      {checked && exercise.explanation && (
        <ExplanationBox explanation={exercise.explanation} />
      )}
    </div>
  );
}

function RunCompletedLines({
  template,
  values,
  blanks,
}: {
  template: string;
  values: string[];
  blanks: LineBlank[];
}) {
  const [open, setOpen] = useState(false);
  const [useRef, setUseRef] = useState(false);

  const code = useMemo(
    () => buildCompletedLines(template, values, blanks, useRef),
    [template, values, blanks, useRef],
  );

  return (
    <div className="rounded-xl border bg-card/50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Play className="h-3.5 w-3.5 text-primary" />
          {open ? "Скрыть запуск" : "Запустить код в Python"}
        </button>
        {open && (
          <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={useRef}
              onChange={(e) => setUseRef(e.target.checked)}
              className="h-3 w-3 accent-primary"
            />
            Использовать эталонные ответы
          </label>
        )}
      </div>
      {open && (
        <div className="border-t">
          <PythonRunner code={code} />
        </div>
      )}
    </div>
  );
}
