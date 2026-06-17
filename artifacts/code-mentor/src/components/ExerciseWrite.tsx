import { useState, useMemo, useCallback } from "react";
import { WriteFromScratchExercise } from "@/data/curriculum";
import { HintBox } from "@/components/HintBox";
import { ExplanationBox } from "@/components/ExplanationBox";
import { PythonRunner, RunResult } from "@/components/PythonRunner";
import { SmartCodeEditor } from "@/components/SmartCodeEditor";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  PenTool,
  AlertTriangle,
  Info,
  Sparkles,
} from "lucide-react";

// ── Anti-cheat: detect keyword stuffing ────────────────────────────────────
function isLikelyStuffed(text: string, required: string[]): boolean {
  if (required.length < 3) return false;
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
  // If fewer real code lines than half the keywords → suspicious
  if (lines.length < Math.ceil(required.length / 2)) {
    const maxOnOneLine = lines.reduce((max, line) => {
      const count = required.filter((kw) => line.includes(kw)).length;
      return Math.max(max, count);
    }, 0);
    if (maxOnOneLine >= Math.ceil(required.length * 0.6)) return true;
  }
  return false;
}

// Check whether the code looks like real Python structure
function hasRealStructure(text: string): boolean {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#"));
  // Real Python has at least some indented lines or multi-statement structure
  const indented = text.split("\n").filter((l) => /^\s{4}/.test(l));
  const hasBlocks =
    /:\s*$/m.test(text) || // colon-terminated line
    indented.length > 0; // indented block
  return hasBlocks || lines.length >= 3;
}

/** Strip comment-only lines so keywords inside #-comments are invisible to grader */
function stripCommentLines(code: string): string {
  return code
    .split("\n")
    .map((line) => (/^\s*#/.test(line) ? "" : line))
    .join("\n");
}

// ── Python synonym map for flexible keyword matching ────────────────────────
const PYTHON_SYNONYMS: Record<string, string[]> = {
  // print variants
  "print(":        ["print (", "sys.stdout.write", "sys.stdout.write("],
  // super() variants
  "super()":       ["super(object,", "super(Base,", "super(Animal,", "super(Shape,", "super(Vehicle,", "super(Person,"],
  // isinstance variants
  "isinstance(":   ["type(", "__class__"],
  // f-string and format
  'f"':            ['.format(', '% (', '% "', 'f\''],
  "f'":            ['.format(', '% (', '% "', 'f"'],
  ".format(":      ['f"', "f'", "% ("],
  // abstract method
  "@abstractmethod": ["raise NotImplementedError", "raise NotImplementedError("],
  // property decorator
  "@property":     ["property(", "def get_"],
  // class method variants
  "@classmethod":  ["@staticmethod"],
  "@staticmethod": ["@classmethod"],
  // raise variants
  "raise ":        ["raise(", "raise ValueError", "raise TypeError", "raise RuntimeError", "raise KeyError", "raise IndexError"],
  "raise ValueError": ["raise TypeError(", "raise RuntimeError(", "raise ValueError("],
  "raise TypeError":  ["raise ValueError(", "raise RuntimeError(", "raise TypeError("],
  // List operations
  ".append(":      ["+= [", "extend([", ".insert(0,", "+ ["],
  ".extend(":      ["+= ", ".append("],
  "sorted(":       [".sort(", ".sort(key=", "sorted(key="],
  ".sort(":        ["sorted("],
  // Dict operations
  ".items()":      [".values()", ".keys()", "for k, v in"],
  ".keys()":       [".items()", "for k in"],
  ".values()":     [".items()", "for v in"],
  ".get(":         ["[", "dict.get("],
  // String methods
  ".strip()":      [".lstrip()", ".rstrip()", ".strip(' ')"],
  ".split(":       [".partition(", ".rsplit("],
  ".join(":        ["''.join", "\"\".join"],
  ".upper()":      [".capitalize()", ".title()"],
  ".lower()":      [".casefold()"],
  ".replace(":     [".translate(", "re.sub("],
  ".startswith(":  ["[:len(", "re.match("],
  ".endswith(":    ["[-len(", "re.search("],
  // Type conversions
  "int(":          ["floor(", "round(", "math.floor(", "math.ceil("],
  "str(":          ['f"', "f'", ".format(", "repr("],
  "float(":        ["Decimal(", "round("],
  "list(":         ["[*", "[x for"],
  "dict(":         ["{**", "dict.fromkeys("],
  "tuple(":        ["(*", "(x for"],
  "set(":          ["{x for", "frozenset("],
  // Loops and iteration
  "for ":          ["while ", "list(map(", "[x for x"],
  "while ":        ["for "],
  "range(":        ["enumerate(range(", "zip(range("],
  "enumerate(":    ["zip(range(", "for i, "],
  "zip(":          ["enumerate(", "itertools.zip_longest("],
  "map(":          ["[x for x", "list(map("],
  "filter(":       ["[x for x in", "list(filter("],
  // Comprehensions
  "[x for":        ["list(map(", "list(filter("],
  "{k:":           ["dict.fromkeys(", "dict(("],
  // None checks
  "is None":       ["== None"],
  "is not None":   ["!= None", "is not None"],
  "== None":       ["is None"],
  "!= None":       ["is not None"],
  // Boolean
  "True":          ["1", "bool(1)"],
  "False":         ["0", "bool(0)"],
  // try/except
  "try:":          ["try :"],
  "except ":       ["except:"],
  "except Exception": ["except BaseException", "except Error"],
  "finally:":      ["finally :"],
  // Context managers
  "with ":         ["with("],
  "contextmanager": ["__enter__", "__exit__"],
  "__enter__":     ["contextmanager"],
  "__exit__":      ["contextmanager"],
  // File operations
  "open(":         ["pathlib.Path(", "Path("],
  "os.path.join(": ["pathlib.Path(", "Path("],
  "Path(":         ["os.path.join(", "open("],
  // OOP magic methods
  "__str__":       ["__repr__"],
  "__repr__":      ["__str__"],
  "__len__":       ["len(self"],
  "__eq__":        ["__ne__"],
  "__lt__":        ["__le__", "__gt__", "__ge__"],
  "__add__":       ["__radd__", "__iadd__"],
  "__init__":      ["__new__"],
  // import styles
  "import ":       ["from "],
  "from ":         ["import "],
  // Assertion
  "assert ":       ["if not ", "raise AssertionError"],
  // Generators
  "yield ":        ["yield(", "return ["],
  "yield from ":   ["for x in ", "yield "],
  // async
  "async def ":    ["def "],
  "await ":        [".result()", "asyncio.run("],
  // sqlite3 patterns
  "sqlite3":       ["sqlite3.connect", "import sqlite3"],
  ".execute(":     ["cursor.execute(", "conn.execute("],
  ".fetchall(":    [".fetchmany(", ".fetchone("],
  ".fetchone(":    [".fetchall("],
  ".commit(":      ["conn.commit(", "cursor.commit("],
  ".rollback(":    ["conn.rollback("],
  "@contextmanager": ["contextmanager", "contextmanager("],
  // SQLAlchemy
  "session.add(":      ["db.session.add("],
  "session.commit(":   ["db.session.commit("],
  "session.get(":      ["session.query(", "db.session.get("],
  "mapped_column(":    ["db.Column(", "Column("],
  "DeclarativeBase":   ["db.Model", "Base"],
  "relationship(":     ["db.relationship(", "ForeignKey("],
  // Common patterns
  "def __init__(self": ["def __init__(self,"],
  "self.":         ["cls.", "obj."],
  "cls.":          ["self.", "type(self)."],
};

/** Flexible Python keyword matching with synonym support */
function pySmartMatch(code: string, kw: string): boolean {
  // 1. Direct match
  if (code.includes(kw)) return true;

  // 2. Case-insensitive for Python keywords
  const lcCode = code.toLowerCase();
  const lcKw = kw.toLowerCase();
  if (lcCode.includes(lcKw)) return true;

  // 3. Whitespace normalisation (print( vs print ()
  const normCode = code.replace(/\s+/g, " ");
  const normKw = kw.replace(/\s+/g, " ");
  if (normCode.includes(normKw)) return true;

  // 4. Quote style variations
  const kwSingle = kw.replace(/"/g, "'");
  const kwDouble = kw.replace(/'/g, '"');
  if (kwSingle !== kw && code.includes(kwSingle)) return true;
  if (kwDouble !== kw && code.includes(kwDouble)) return true;

  // 5. Synonym lookup (bidirectional)
  for (const [key, syns] of Object.entries(PYTHON_SYNONYMS)) {
    const keyLc = key.toLowerCase();
    if (lcKw.includes(keyLc) || keyLc.includes(lcKw)) {
      for (const syn of syns) {
        if (lcCode.includes(syn.toLowerCase())) return true;
      }
    }
    if (syns.some((s) => s.toLowerCase() === lcKw)) {
      if (lcCode.includes(keyLc)) return true;
      for (const s of syns) {
        if (s.toLowerCase() !== lcKw && lcCode.includes(s.toLowerCase())) return true;
      }
    }
  }

  // 6. Decorator flexibility: @classmethod matches "classmethod" and vice versa
  if (kw.startsWith("@")) {
    if (code.includes(kw.slice(1))) return true;
  } else if (code.includes("@" + kw)) return true;

  // 7. Optional trailing colon for blocks: "try" matches "try:"
  if (!kw.endsWith(":") && code.includes(kw + ":")) return true;

  // 8. Method call flexibility: "obj.method" matches "obj.method(" and vice versa
  if (!kw.endsWith("(") && code.includes(kw + "(")) return true;

  return false;
}

function gradeWrite(text: string, ex: WriteFromScratchExercise, pyResult?: RunResult | null) {
  const trimmed = text.replace(/\r/g, "");
  const nonEmptyLines = trimmed
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#")).length;

  const stuffed = isLikelyStuffed(trimmed, ex.required) && !hasRealStructure(trimmed);

  // If code compiled + ran successfully in Pyodide → definitely not stuffed
  const ranOk = pyResult?.success === true;
  const effectiveStuffed = stuffed && !ranOk;

  // Only check keywords in non-comment lines (prevents #-comment bypass)
  const codeForKeywords = stripCommentLines(trimmed);
  const requiredHits = ex.required.filter((kw) => pySmartMatch(codeForKeywords, kw));
  const requiredOk = effectiveStuffed ? 0 : requiredHits.length;
  const requiredTotal = ex.required.length;
  const hasMinLines = nonEmptyLines >= ex.minLines;

  return {
    earned: requiredOk,
    maxScore: requiredTotal,
    requiredOk,
    requiredTotal,
    hasMinLines,
    nonEmptyLines,
    stuffed: effectiveStuffed,
    ranOk,
    missing: ex.required.filter((kw) => !pySmartMatch(codeForKeywords, kw)),
  };
}

export function ExerciseWrite({
  exercise,
  onComplete,
  initialCode = "",
  onInputChange,
}: {
  exercise: WriteFromScratchExercise;
  onComplete: (score: number, max: number, meta: { hintsRevealed: number; input?: string | string[] }) => void;
  initialCode?: string;
  onInputChange?: (code: string) => void;
}) {
  const [code, setCode] = useState(initialCode);
  const [checked, setChecked] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [pyResult, setPyResult] = useState<RunResult | null>(null);

  const handleChange = useCallback(
    (val: string) => {
      setCode(val);
      if (checked) setChecked(false);
      if (pyResult) setPyResult(null);
      onInputChange?.(val);
    },
    [checked, pyResult, onInputChange],
  );

  const handlePyResult = useCallback((r: RunResult) => {
    setPyResult(r);
  }, []);

  const result = useMemo(
    () => (checked ? gradeWrite(code, exercise, pyResult) : null),
    [checked, code, exercise, pyResult],
  );

  const onCheck = () => setChecked(true);

  const onNext = () => {
    const r = gradeWrite(code, exercise, pyResult);
    onComplete(r.earned, r.maxScore, { hintsRevealed, input: code });
  };

  const scoreColor =
    !result
      ? ""
      : result.stuffed
        ? "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30"
        : result.earned === result.maxScore
          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
          : result.earned >= result.maxScore / 2
            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-emerald-500/15 text-emerald-400 grid place-items-center flex-shrink-0">
          <PenTool className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-emerald-400 mb-1">
            Напиши с нуля
          </div>
          <h3 className="text-xl font-semibold leading-tight">{exercise.title}</h3>
        </div>
      </div>

      {/* Task */}
      <div className="rounded-xl border bg-card p-5">
        <div className="text-base text-foreground leading-relaxed whitespace-pre-line">
          {exercise.task}
        </div>
        {exercise.required.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              Что должно быть в коде:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exercise.required.map((kw) => (
                <code
                  key={kw}
                  className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs border border-primary/20 font-mono"
                >
                  {kw}
                </code>
              ))}
            </div>
          </div>
        )}
        <div className="mt-3 text-xs text-muted-foreground flex items-start gap-2">
          <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            Напиши настоящий рабочий Python. После написания — нажми «Запустить» чтобы
            увидеть вывод, затем «Проверить» для оценки.
          </span>
        </div>
      </div>

      {/* Smart code editor */}
      <SmartCodeEditor
        value={code}
        onChange={handleChange}
        placeholder={"# Напиши код здесь\n# Tab = 4 пробела, Enter = авто-отступ\n"}
        minHeight={280}
        data-testid="textarea-write-code"
      />

      {/* Pyodide runner */}
      <PythonRunner code={code} onResult={handlePyResult} />

      {/* Hints */}
      <HintBox
        hints={exercise.hints}
        label="Подсказки по решению"
        onHintReveal={(n) => setHintsRevealed(n)}
      />

      {/* Action buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {(!checked || (result && result.earned < result.maxScore)) && (
          <Button
            onClick={onCheck}
            disabled={code.trim().length === 0}
            data-testid="button-check-write"
          >
            Проверить
          </Button>
        )}
        {checked && result && (
          <>
            <div
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md border ${scoreColor}`}
            >
              {result.stuffed ? (
                <AlertTriangle className="h-4 w-4" />
              ) : result.earned === result.maxScore ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {result.stuffed
                ? "Код не выглядит рабочим"
                : `${result.earned} / ${result.maxScore} баллов`}
            </div>
            <Button onClick={onCheck} variant="outline" size="sm">
              Перепроверить
            </Button>
            <Button onClick={onNext} data-testid="button-next-write">
              Дальше
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Check result details */}
      {checked && result && (
        <div className="rounded-xl border bg-muted/20 p-4 text-sm space-y-3">
          <div className="font-medium text-sm">Результат проверки:</div>

          {result.stuffed && (
            <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 p-3 text-xs text-orange-300 leading-relaxed">
              <strong>Ключевые слова есть, но код не похож на настоящий Python.</strong>{" "}
              Напиши полноценную программу: блоки с двоеточием, тело с отступом,
              return с выражением. Нельзя просто перечислить нужные слова в одну строку.
            </div>
          )}

          {result.ranOk && !result.stuffed && (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Код запустился успешно — это значит, что он синтаксически верный.
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              {result.hasMinLines ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span className={result.hasMinLines ? "" : "text-muted-foreground"}>
                Объём: {result.nonEmptyLines} строк кода
                {!result.hasMinLines &&
                  ` (рекомендуется ≥ ${exercise.minLines} — ориентир, не жёсткое требование)`}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {result.requiredOk === result.requiredTotal && !result.stuffed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span>
                Конструкции Python: {result.stuffed ? 0 : result.requiredOk} из{" "}
                {result.requiredTotal}
              </span>
            </div>
          </div>

          {result.missing.length > 0 && !result.stuffed && (
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">
                Не нашли в твоём коде:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map((kw) => (
                  <code
                    key={kw}
                    className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-xs border border-rose-500/20 font-mono"
                  >
                    {kw}
                  </code>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2 italic">
                Добавь недостающие конструкции и нажми «Перепроверить». Или запусти
                код чтобы проверить, работает ли он.
              </div>
            </div>
          )}
        </div>
      )}

      {checked && exercise.explanation && (
        <ExplanationBox explanation={exercise.explanation} />
      )}
    </div>
  );
}
