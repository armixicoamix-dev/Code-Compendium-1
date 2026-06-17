import { useEffect, useMemo, useRef } from "react";
import { highlightPython } from "@/lib/highlight";

export interface CodeBlanksProps {
  code: string;
  answers: string[][];
  onCheck?: (correct: number, total: number) => void;
  checked: boolean;
  values: string[];
  onChange: (values: string[]) => void;
  filename?: string;
  lang?: string;
}

interface Part {
  kind: "text" | "blank";
  value: string;
  index?: number;
}

function splitCode(code: string): Part[] {
  const parts: Part[] = [];
  const re = /\{\{(\d+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: "text", value: code.slice(lastIndex, match.index) });
    }
    parts.push({ kind: "blank", value: "", index: parseInt(match[1], 10) });
    lastIndex = re.lastIndex;
  }

  if (lastIndex < code.length) {
    parts.push({ kind: "text", value: code.slice(lastIndex) });
  }

  return parts;
}

function norm(s: string): string {
  return s
    .replace(/`/g, "")           // strip backticks
    .replace(/\(\)/g, "")        // strip trailing ()
    .replace(/^['"]+|['"]+$/g, "") // strip surrounding quotes
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normSet(s: string): string {
  return norm(s)
    .split(/\s*[,;/|]\s*/)
    .map((t) => t.trim())
    .filter(Boolean)
    .sort()
    .join("|");
}

// Accept "self" when blank expects "self", etc. — also strip __dunder__ underscores for comparison
function normFlex(s: string): string {
  const base = norm(s);
  // If looks like dunder method name, strip underscores for comparison
  if (/^__\w+__$/.test(base)) return base.replace(/__/g, "");
  return base;
}

// Wildcards: if accepted list contains one of these special markers,
// accept any value that matches the type pattern.
const WILDCARD_CHECKS: Record<string, (v: string) => boolean> = {
  __str__: (v) => /^(['"]).*\1$/.test(v.trim()),
  __int__: (v) => /^-?\d+$/.test(v.trim()),
  __float__: (v) => /^-?\d+\.\d*$/.test(v.trim()) || /^-?\d*\.\d+$/.test(v.trim()),
  __bool__: (v) => v.trim() === "True" || v.trim() === "False",
  __any__: () => true,
};

export function isBlankCorrect(value: string, accepted: string[]): boolean {
  const v = norm(value);
  const vs = normSet(value);
  const vf = normFlex(value);
  if (!v) return false;
  return accepted.some((a) => {
    // Wildcard type-based matching
    if (a in WILDCARD_CHECKS) return WILDCARD_CHECKS[a](value);
    const an = norm(a);
    const as_ = normSet(a);
    const af = normFlex(a);
    return v === an || vs === as_ || vf === af;
  });
}

export function CodeBlanks({
  code,
  answers,
  checked,
  values,
  onChange,
  filename,
  lang,
}: CodeBlanksProps) {
  const parts = useMemo(() => splitCode(code), [code]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const totalLines = useMemo(() => code.split("\n").length, [code]);
  const lineNumbers = useMemo(
    () => Array.from({ length: totalLines }, (_, i) => i + 1).join("\n"),
    [totalLines],
  );

  const resize = (idx: number, val: string) => {
    const el = inputsRef.current[idx];
    if (!el) return;
    const expectedLen = Math.max(
      val.length,
      ...(answers[idx] ?? []).map((a) => a.length),
      4,
    );
    el.style.width = `${expectedLen * 0.62 + 1.2}em`;
  };

  useEffect(() => {
    parts.forEach((p) => {
      if (p.kind === "blank" && p.index !== undefined) {
        resize(p.index, values[p.index] ?? "");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, parts]);

  const rendered: React.ReactNode[] = [];
  parts.forEach((p, i) => {
    if (p.kind === "text") {
      rendered.push(
        <span
          key={`t-${i}`}
          dangerouslySetInnerHTML={{ __html: highlightPython(p.value) }}
        />,
      );
    } else {
      const idx = p.index!;
      const value = values[idx] ?? "";
      const accepted = answers[idx] ?? [];
      const correct = checked ? isBlankCorrect(value, accepted) : null;
      rendered.push(
        <input
          key={`b-${i}`}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          value={value}
          onChange={(e) => {
            const next = [...values];
            next[idx] = e.target.value;
            onChange(next);
            resize(idx, e.target.value);
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          placeholder={`#${idx + 1}`}
          className={`blank-input ${
            correct === true ? "correct" : correct === false ? "incorrect" : ""
          }`}
          data-testid={`blank-${idx}`}
        />,
      );
    }
  });

  const resolvedFilename = filename ?? (lang && lang !== "Python" ? "index.html" : "exercise.py");
  const resolvedLang = lang ?? "Python";

  return (
    <div className="code-editor">
      <div className="code-editor__chrome">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="code-editor__filename">{resolvedFilename}</span>
        <span className="code-editor__lang">{resolvedLang}</span>
      </div>
      <div className="code-editor__body">
        <div className="code-editor__gutter">{lineNumbers}</div>
        <div className="code-editor__code">{rendered}</div>
      </div>
    </div>
  );
}

export function gradeBlanks(values: string[], answers: string[][]) {
  let correct = 0;
  for (let i = 0; i < answers.length; i++) {
    if (isBlankCorrect(values[i] ?? "", answers[i])) correct++;
  }
  return { correct, total: answers.length };
}
